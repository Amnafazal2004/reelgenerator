import { Composition, registerRoot } from "remotion";
import { ReelVideo } from '../app/reelediting/ReelVideo';


//to download the video
export const RemotionRoot = () => {

  return (
    <Composition
      id="ReelVideo"
      component={ReelVideo}
      durationInFrames={(20)*30}  //will use this value only if reelData is not present in input props
      fps={30}
      width={1920}
      height={1080}
      
      
      
    />
  );
};

registerRoot(RemotionRoot);