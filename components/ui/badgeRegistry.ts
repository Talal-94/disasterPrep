import { ImageSourcePropType } from "react-native";
import badgeFirstResource from "../../assets/badges/reader.png";
import badge5Resources from "../../assets/badges/informed.png";
import badgeFirstQuiz from "../../assets/badges/quizSolver.png";

const BADGE_ICONS: Record<string, ImageSourcePropType> = {
    badge_first_resource: badgeFirstResource,
    badge_5_resources: badge5Resources,
    badge_first_quiz: badgeFirstQuiz,
};

export function getBadgeIcon(id: string): ImageSourcePropType {
    return BADGE_ICONS[id] ?? badgeFirstResource;
}
