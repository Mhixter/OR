import assert from "node:assert/strict";
import { once } from "node:events";
import { spawn } from "node:child_process";
import { after, before, test } from "node:test";
import pg from "pg";

const { Pool } = pg;
const port = 5055;
const baseUrl = `http://127.0.0.1:${port}`;
const testRun = `persistence-${Date.now()}`;
const serverEnv = { ...process.env, PORT: String(port), NODE_ENV: "development" };
let serverProcess;
let database;

const workflows = [
  {
    flowId: "deposit-local",
    viewId: "collections",
    recordType: "Deposit",
    fields: { amount: "1200", phone: "70123456" },
  },
  {
    flowId: "transfers",
    viewId: "transfers",
    recordType: "Transfer",
    fields: { amount: "2500", beneficiary: "Airtel distribution" },
  },
  {
    flowId: "qr",
    viewId: "qr",
    recordType: "QR payment",
    fields: { amount: "800", merchant: "Sahel Market" },
  },
  {
    flowId: "register",
    viewId: "register",
    recordType: "Register entry",
    fields: { amount: "4500", movement: "Cash in" },
  },
  {
    flowId: "revenue",
    viewId: "revenue",
    recordType: "Revenue entry",
    fields: { amount: "6500", source: "Counter sale" },
  },
  {
    flowId: "verify",
    viewId: "verify",
    recordType: "Verification",
    fields: { amount: "42000", reference: "OM-PAY-845101" },
  },
  {
    flowId: "orange-send-money",
    viewId: "orange-send-money",
    recordType: "Send money",
    fields: { amount: "3000", phone: "70987654" },
  },
  {
    flowId: "orange-withdraw-money",
    viewId: "orange-withdraw-money",
    recordType: "Withdrawal",
    fields: { amount: "5000", location: "Ouagadougou · Patte d’Oie" },
  },
  {
    flowId: "orange-pay-purchases",
    viewId: "orange-pay-purchases",
    recordType: "Purchase payment",
    fields: { amount: "7100", merchant: "Sahel Market" },
  },
  {
    flowId: "orange-buy-credit",
    viewId: "orange-buy-credit",
    recordType: "Airtime top up",
    fields: { amount: "1000", phone: "70112233" },
  },
  {
    flowId: "orange-virtual-card",
    viewId: "orange-virtual-card",
    recordType: "Virtual card",
    fields: { nickname: "Online shopping" },
  },
  {
    flowId: "orange-service-loyalty",
    viewId: "orange-service-loyalty",
    recordType: "Service record",
    fields: {},
  },
  {
    flowId: "orange-service-manage-money",
    viewId: "orange-service-manage-money",
    recordType: "Service record",
    fields: { amount: "9000", destination: "Savings account" },
  },
  {
    flowId: "orange-service-boost",
    viewId: "orange-service-boost",
    recordType: "Service record",
    fields: {},
  },
  {
    flowId: "orange-service-loans",
    viewId: "orange-service-loans",
    recordType: "Service record",
    fields: { amount: "15000", term: "14 days" },
  },
  {
    flowId: "orange-service-bills",
    viewId: "orange-service-bills",
    recordType: "Service record",
    fields: { amount: "3200", biller: "ONEA water", customer: "ONEA-2031" },
  },
  {
    flowId: "orange-service-airtime",
    viewId: "orange-service-airtime",
    recordType: "Service record",
    fields: { amount: "750", phone: "70887766" },
  },
  {
    flowId: "orange-service-data",
    viewId: "orange-service-data",
    recordType: "Service record",
    fields: { phone: "70776655", bundle: "2 GB · 2,000 FCFA" },
  },
  {
    flowId: "orange-service-tv",
    viewId: "orange-service-tv",
    recordType: "Service record",
    fields: { amount: "4500", provider: "Canal+", customer: "CANAL-4001" },
  },
  {
    flowId: "orange-service-school",
    viewId: "orange-service-school",
    recordType: "Service record",
    fields: { amount: "12000", student: "STUDENT-17" },
  },
  {
    flowId: "orange-service-insurance",
    viewId: "orange-service-insurance",
    recordType: "Service record",
    fields: { plan: "Family cover" },
  },
];

const requestJson = async (path, options) => {
  const response = await fetch(`${baseUrl}${path}`, options);
  const body = await response.json();
  return { response, body };
};

const postEvent = (payload, viewId) => requestJson("/api/events", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ eventType: "local_record_saved", viewId, payload }),
});

const getTestEvents = async () => {
  const { response, body } = await requestJson("/api/events?limit=100");
  assert.equal(response.status, 200);
  return body.events.filter((event) => event.payload?.testRun === testRun);
};

before(async () => {
  database = new Pool({ connectionString: process.env.DATABASE_URL });
  serverProcess = spawn(process.execPath, ["server.mjs"], { env: serverEnv, stdio: ["ignore", "pipe", "pipe"] });
  let output = "";
  const ready = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`Timed out starting test server. ${output}`)), 15000);
    serverProcess.stdout.on("data", (chunk) => {
      output += chunk.toString();
      if (output.includes(`port ${port}`)) {
        clearTimeout(timeout);
        resolve();
      }
    });
    serverProcess.stderr.on("data", (chunk) => { output += chunk.toString(); });
    serverProcess.once("error", reject);
    serverProcess.once("exit", (code) => {
      if (code !== null && code !== 0) reject(new Error(`Test server exited with code ${code}. ${output}`));
    });
  });
  await ready;
  const { response } = await requestJson("/api/health");
  assert.equal(response.status, 200);
});

after(async () => {
  await database.query("DELETE FROM app_events WHERE payload->>'testRun' = $1", [testRun]);
  await database.end();
  serverProcess?.kill("SIGTERM");
  await once(serverProcess, "exit").catch(() => {});
});

test("every local workflow survives a fresh events read with a stable reference and status", async () => {
  for (const workflow of workflows) {
    const reference = `TEST-${testRun}-${workflow.flowId}`;
    const payload = {
      flowId: workflow.flowId,
      recordType: workflow.recordType,
      title: workflow.flowId,
      status: "Saved locally",
      testRun,
      ...workflow.fields,
      fields: workflow.fields,
      reference,
    };
    const { response, body } = await postEvent(payload, workflow.viewId);
    assert.equal(response.status, 201, workflow.flowId);
    assert.equal(body.event.payload.reference, reference, workflow.flowId);
    assert.equal(body.event.payload.status, "Saved locally", workflow.flowId);
  }

  const firstRead = await getTestEvents();
  assert.equal(firstRead.length, workflows.length);
  for (const workflow of workflows) {
    const event = firstRead.find((candidate) => candidate.payload.flowId === workflow.flowId);
    assert.ok(event, `missing ${workflow.flowId} after first read`);
    assert.equal(event.event_type, "local_record_saved");
    assert.equal(event.view_id, workflow.viewId);
    assert.equal(event.payload.reference, `TEST-${testRun}-${workflow.flowId}`);
    assert.equal(event.payload.status, "Saved locally");
  }

  const secondRead = await getTestEvents();
  assert.deepEqual(
    secondRead.map((event) => event.payload.reference).sort(),
    firstRead.map((event) => event.payload.reference).sort(),
  );
  assert.ok(secondRead.every((event) => event.payload.status === "Saved locally"));
});

test("invalid local forms are rejected before an event is created", async () => {
  for (const workflow of workflows) {
    const fields = { ...workflow.fields };
    const fieldToInvalidate = Object.hasOwn(fields, "amount")
      ? "amount"
      : Object.hasOwn(fields, "phone")
        ? "phone"
        : Object.keys(fields)[0];
    if (!fieldToInvalidate) continue;
    if (fieldToInvalidate) fields[fieldToInvalidate] = fieldToInvalidate === "amount" ? "0" : fieldToInvalidate === "phone" ? "123" : "";
    const payload = {
      flowId: workflow.flowId,
      recordType: workflow.recordType,
      reference: `INVALID-${testRun}-${workflow.flowId}`,
      testRun: `invalid-${testRun}`,
      ...fields,
      fields,
    };
    const { response } = await postEvent(payload, workflow.viewId);
    assert.equal(response.status, 400, workflow.flowId);
  }

  const unknownFlow = await postEvent({
    flowId: "not-a-local-workflow",
    reference: `INVALID-${testRun}-unknown`,
    testRun: `invalid-${testRun}`,
  }, "not-a-local-workflow");
  assert.equal(unknownFlow.response.status, 400);
  assert.equal((await getTestEvents()).length, workflows.length);
});