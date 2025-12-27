import RadioTower from "../icons/radio-tower";
import ShieldLink from "../icons/shield-link";
import { H3 } from "../ui/typography";
import CheckboxCard from "./checkbox-card";

const navigationLabel = (
  <>
    Navigation <ShieldLink />
  </>
);

const patternLabel = (
  <>
    Pattern <RadioTower />
  </>
);

export default function DefaultSections({ state, handleProtectionToggle }) {
  return (
    <div className="flex flex-col gap-y-1 card-purple">
      <H3>Default Sections</H3>

      <div className="grid grid-cols-2 gap-2">
        <CheckboxCard
          id="defaultrules"
          label="Selector Rules"
          checked={state.protectionSystems.defaultRules}
          onChange={(newState) =>
            handleProtectionToggle("defaultRules", newState)
          }
        />
        <CheckboxCard
          id="patternrules"
          checked={state.protectionSystems.patternRules}
          label={patternLabel}
          onChange={(newState) =>
            handleProtectionToggle("patternRules", newState)
          }
        />
        <CheckboxCard
          id="requestblocking"
          checked={state.protectionSystems.requestBlocking}
          label="Block Requests"
          onChange={(newState) =>
            handleProtectionToggle("requestBlocking", newState)
          }
        />
        <CheckboxCard
          id="navigationguard"
          checked={state.protectionSystems.navigationGuard}
          label={navigationLabel}
          onChange={(newState) =>
            handleProtectionToggle("navigationGuard", newState)
          }
        />
      </div>
    </div>
  );
}
