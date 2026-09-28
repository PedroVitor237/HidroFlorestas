import { prepareUiReserve, uiAccountProfile } from "./imp006-ui-account";
import { describeImp006Error } from "./imp006-gate-diagnostics";

async function main() {
  const profile = uiAccountProfile(process.argv[2]);
  if (profile === "legacy") throw new Error("Choose reserve-01 or reserve-02 for create-only preparation");
  const result = await prepareUiReserve(profile, process.env);
  process.stdout.write(`IMP-006 owned UI account ${result.profile}: target=${result.fingerprint}, capacity=${result.capacity}, ${result.created ? "created" : "reused"}. Secret remains local.\n`);
}

void main().catch((error) => {
  process.stderr.write(`IMP-006 UI account preparation: ${describeImp006Error(error, process.env)}\n`);
  process.exitCode = 1;
});
