import { DriveToday } from "./components/DriveToday";
import { Features } from "./components/Features";
import { FirstBlock } from "./components/FirstBlock";
import { OurFleet } from "./components/OurFleet";
import SliderBrands from "./components/SliderBrands/SliderBrands";

export default function Home() {
  return (
    <div>
      <FirstBlock />
      <SliderBrands />
      <Features />
      <OurFleet />
      <DriveToday />
    </div>
  );
}
