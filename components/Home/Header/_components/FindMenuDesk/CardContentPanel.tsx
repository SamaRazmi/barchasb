import SkillsContent from "./contents/SkillsContent";
import CategoriesContent from "./contents/CategoriesContent";
import AddressContent from "./contents/AddressContent";

interface CardContentPanelProps {
  selectedId: number;
}

const CardContentPanel: React.FC<CardContentPanelProps> = ({ selectedId }) => {
  switch (selectedId) {
    case 1:
      return <SkillsContent />;
    case 2:
      return <CategoriesContent />;
    case 3:
      return <AddressContent />;
    default:
      return null;
  }
};

export default CardContentPanel;
