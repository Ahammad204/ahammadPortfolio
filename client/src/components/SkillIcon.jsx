import * as SiIcons from "react-icons/si";
import * as FaIcons from "react-icons/fa";
import * as TbIcons from "react-icons/tb";

const iconMap = {
  ...SiIcons,
  ...FaIcons,
  ...TbIcons,
};

export default function SkillIcon({ name, size = 18, className = "text-primary" }) {
  if (!name) {
    return <span className={`text-lg ${className}`}>⚡</span>;
  }

  const IconComp = iconMap[name];
  if (!IconComp) {
    return (
      <span className={`text-lg font-mono ${className}`}>
        {name.replace("Si", "").replace("Fa", "").replace("Tb", "")}
      </span>
    );
  }

  return <IconComp size={size} className={className} style={{ fill: "currentColor" }} />;
}
