import { Composition } from "remotion";
import { ReelVideo } from '@/app/reelediting/ReelVideo';
import { useReelContext } from "@/Context/ReelContext";

//to download the video
export const RemotionRoot = () => {
    const { reelData } = useReelContext()
  return (
    <Composition
      id="MyComposition"
      durationInFrames={reelData.metadata.duration * 30}
      fps={30}
      width={1920}
      height={1080}
      component={() => <ReelVideo reelData={reelData} />}
      //the component part should be the same as Player,  it is whatever u want to make a video of
    />
  );
};