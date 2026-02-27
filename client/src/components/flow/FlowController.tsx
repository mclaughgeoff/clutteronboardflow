import { useState, useCallback, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { FlowContext, defaultState, type FlowState } from "@/lib/state";
import ProgressBar from "./ProgressBar";
import TopNav from "./TopNav";
import Screen1Zip from "@/components/screens/Screen1Intent";
import Screen2Intent from "@/components/screens/Screen2Intent";
import Screen3Education from "@/components/screens/Screen3Education";
import Screen4Size from "@/components/screens/Screen4Size";
import ScreenAdvisor from "@/components/screens/ScreenAdvisor";
import Screen5Confirmation from "@/components/screens/Screen5Pricing";
import Screen5BTimeline from "@/components/screens/Screen5BTimeline";
import Screen5CSubjobs from "@/components/screens/Screen5CSubjobs";
import Screen6Tier from "@/components/screens/Screen6Tier";
import Screen7Pricing from "@/components/screens/Screen7Tier";
import Screen8Date from "@/components/screens/Screen7Date";
import Screen9Lead from "@/components/screens/Screen8Lead";
import Screen10Addons from "@/components/screens/Screen9Addons";
import Screen11Review from "@/components/screens/Screen10Review";
import ScreenSuccess from "@/components/screens/ScreenSuccess";
import MovingScreen1Dates from "@/components/screens/MovingScreen1Dates";
import MovingScreen2Stuff from "@/components/screens/MovingScreen2Stuff";
import MovingScreen3Tier from "@/components/screens/MovingScreen3Tier";
import MovingScreen4Education from "@/components/screens/MovingScreen4Education";
import MovingScreen5Outcome from "@/components/screens/MovingScreen5Outcome";
import MovingLeadCapture from "@/components/screens/MovingLeadCapture";
import MovingSuccess from "@/components/screens/MovingSuccess";

const branchAScreens = [
  'screen-1', 'screen-2', 'screen-3', 'screen-4', 'screen-5',
  'screen-5b', 'screen-5c', 'screen-6', 'screen-7', 'screen-date', 'screen-lead',
  'screen-addons', 'screen-review', 'screen-success'
];

const movingScreens = [
  'screen-1', 'screen-2', 'moving-dates', 'moving-stuff', 'moving-tier',
  'moving-education', 'moving-outcome', 'moving-lead', 'moving-success'
];

function getScreensForBranch(branch: string | null): string[] {
  if (branch === 'B1' || branch === 'B2' || branch === 'B3' || branch === 'B4') return movingScreens;
  return branchAScreens;
}

const noProgressScreens = ['screen-success', 'moving-success'];
const noNavScreens = ['screen-success', 'moving-success'];

export default function FlowController() {
  const [flowState, setFlowState] = useState<FlowState>(defaultState);
  const [screenStack, setScreenStack] = useState<string[]>(['screen-1']);

  const setState = useCallback((updater: Partial<FlowState> | ((prev: FlowState) => Partial<FlowState>)) => {
    setFlowState(prev => {
      const updates = typeof updater === 'function' ? updater(prev) : updater;
      return { ...prev, ...updates };
    });
  }, []);

  const currentScreen = screenStack[screenStack.length - 1];
  const screens = getScreensForBranch(flowState.branch);
  const currentIdx = screens.indexOf(currentScreen);
  const totalScreens = screens.length;

  const goTo = useCallback((screenId: string) => {
    setScreenStack(prev => [...prev, screenId]);
  }, []);

  const goBack = useCallback(() => {
    if (screenStack.length <= 1) return;
    setScreenStack(prev => prev.slice(0, -1));
  }, [screenStack.length]);

  const showProgress = !noProgressScreens.includes(currentScreen);
  const showNav = !noNavScreens.includes(currentScreen);

  const contextValue = useMemo(() => ({ state: flowState, setState }), [flowState, setState]);

  function renderScreen() {
    const props = { goTo, goBack };
    switch (currentScreen) {
      case 'screen-1': return <Screen1Zip key="s1" {...props} />;
      case 'screen-2': return <Screen2Intent key="s2" {...props} />;
      case 'screen-3': return <Screen3Education key="s3" {...props} />;
      case 'screen-4': return <Screen4Size key="s4" {...props} />;
      case 'screen-advisor': return <ScreenAdvisor key="sadvisor" {...props} />;
      case 'screen-5': return <Screen5Confirmation key="s5" {...props} />;
      case 'screen-5b': return <Screen5BTimeline key="s5b" {...props} />;
      case 'screen-5c': return <Screen5CSubjobs key="s5c" {...props} />;
      case 'screen-6': return <Screen6Tier key="s6" {...props} />;
      case 'screen-7': return <Screen7Pricing key="s7" {...props} />;
      case 'screen-date': return <Screen8Date key="sdate" {...props} />;
      case 'screen-lead': return <Screen9Lead key="slead" {...props} />;
      case 'screen-addons': return <Screen10Addons key="saddons" {...props} />;
      case 'screen-review': return <Screen11Review key="sreview" {...props} />;
      case 'screen-success': return <ScreenSuccess key="ssuccess" {...props} />;
      case 'moving-dates': return <MovingScreen1Dates key="mdates" {...props} />;
      case 'moving-stuff': return <MovingScreen2Stuff key="mstuff" {...props} />;
      case 'moving-tier': return <MovingScreen3Tier key="mtier" {...props} />;
      case 'moving-education': return <MovingScreen4Education key="medu" {...props} />;
      case 'moving-outcome': return <MovingScreen5Outcome key="moutcome" {...props} />;
      case 'moving-lead': return <MovingLeadCapture key="mlead" {...props} />;
      case 'moving-success': return <MovingSuccess key="msuccess" {...props} />;
      default: return <Screen1Zip key="s1" {...props} />;
    }
  }

  return (
    <FlowContext.Provider value={contextValue}>
      <div className="min-h-screen bg-warm flex items-center justify-center p-4">
        <div
          className="w-full max-w-[430px] min-h-[780px] bg-white rounded-[40px] shadow-[0_30px_80px_rgba(0,0,0,0.18),0_0_0_1px_rgba(0,0,0,0.06)] flex flex-col relative overflow-hidden"
          data-testid="phone-frame"
        >
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-[120px] h-[5px] bg-grey-light rounded-full" />
          </div>
          {showNav && (
            <TopNav
              canGoBack={screenStack.length > 1}
              onBack={goBack}
            />
          )}
          {showProgress && (
            <ProgressBar current={Math.max(currentIdx, 0)} total={totalScreens - 1} />
          )}
          <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
            <AnimatePresence mode="wait">
              {renderScreen()}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </FlowContext.Provider>
  );
}
