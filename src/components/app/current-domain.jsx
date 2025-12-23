import IconExpandButton from "../ui/button/icon-expand";
import { H3, Text } from "../ui/typography";

export default function CurrentDomain({
  domain,
  isWhitelisted,
  onWhitelistToggle,
}) {
  if (!domain) return null;

  return (
    <div className="px-4 py-3 bg-[#bb92e7]/20 rounded-lg">
      <div className="flex items-center w-full justify-between">
        <H3>Current Domain</H3>
        <IconExpandButton
          icon={isWhitelisted ? "minus" : "plus"}
          onClick={onWhitelistToggle}
        >
          {isWhitelisted ? "from Whitelist" : "to Whitelist"}
        </IconExpandButton>
      </div>

      <Text className="italic font-days-one">{domain}</Text>
    </div>
  );
}
