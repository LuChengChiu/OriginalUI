import IconExpandButton from "../ui/button/icon-expand";
import { H3, H4, Text } from "../ui/typography";

const renderRuleCount = (label, count) => {
  return (
    <div className="flex justify-between items-center">
      <Text>{label}</Text>

      <Text className="text-sm font-semibold text-[#913ced]">{count}</Text>
    </div>
  );
};

export default function RuleStates({ domain, stats, onResetStats }) {
  if (!domain) return null;

  const defaultCount = stats?.defaultRulesRemoved || 0;
  const customCount = stats?.customRulesRemoved || 0;

  return (
    <div className="py-2 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <H3>Removal Stats</H3>

        {stats && onResetStats && (
          <IconExpandButton
            icon="reset-setting"
            onClick={() => onResetStats(domain)}
            containerClassName="hover:!w-26"
          >
            Reset
          </IconExpandButton>
        )}
      </div>

      <div className="space-y-2 pr-2">
        {renderRuleCount("Default Rules:", `${defaultCount} elements`)}
        {customCount > 0 &&
          renderRuleCount("Custom Rules:", `${customCount} elements`)}

        <div className="flex mt-2 pt-2 border-t border-gray-200 justify-between items-center">
          <H4>Total:</H4>
          <Text className="font-bold">
            {defaultCount + customCount} elements
          </Text>
        </div>
      </div>
    </div>
  );
}
