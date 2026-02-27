import { useState, useCallback, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { FlowContext, defaultState, type FlowState } from "@/lib/state";
import ProgressBar from "./ProgressBar";
import TopNav from "./TopNav";
import Screen1Intent from "@/components/screens/Screen1Intent";
import Screen2Situation from "@/components/screens/Screen2Situation";
import Screen2BConfirmation from "@/components/screens/Screen2BConfirmation";
import Screen3Education from "@/components/screens/Screen3Education";
import Screen4Size from "@/components/screens/Screen4Size";
import Screen5Pricing from "@/components/screens/Screen5Pricing";
import Screen6Plan from "@/components/screens/Screen6Tier";
import Screen7Tier from "@/components/screens/Screen7Tier";
import Screen8Date from "@/components/screens/Screen7Date";
import Screen9Lead from "@/components/screens/Screen8Lead";
import Screen10Addons from "@/components/screens/Screen9Addons";
import Screen11Review from "@/components/screens/Screen10Review";
import ScreenSuccess from "@/components/screens/ScreenSuccess";
import ScreenFlexHandoff from "@/components/screens/ScreenFlexHandoff";

const branchAScreens = [
  'screen-1', 'screen-2', 'screen-3', 'screen-4', 'screen-5',
  'screen-6', 'screen-7', 'screen-date', 'screen-lead', 'screen-addons', 'screen-review', 'screen-success'
];
const branchB1Screens = [
  'screen-1', 'screen-3', 'screen-4', 'screen-5',
  'screen-6', 'screen-7', 'screen-date', 'screen-lead', 'screen-addons', 'screen-review', 'screen-success'
];
const branchB2Screens = ['screen-1', 'screen-flex', 'screen-lead', 'screen-success'];
const branchB3Screens = [
  'screen-1', 'screen-3', 'screen-4', 'screen-5',
  'screen-6', 'screen-7', 'screen-date', 'screen-lead', 'screen-addons', 'screen-review', 'screen-success'
];
const branchB4Screens = ['screen-1', 'screen-flex', 'screen-lead', 'screen-success'];

function getScreensForBranch(branch: string | null): string[] {
  switch (branch) {
    case 'B1': return branchB1Screens;
    case 'B2': return branchB2Screens;
    case 'B3': return branchB3Screens;
    case 'B4': return branchB4Screens;
    default: return branchAScreens;
  }
}

const noProgressScreens = ['screen-success'];
const noNavScreens = ['screen-success'];

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
      case 'screen-1': return <Screen1Intent key="s1" {...props} />;
      case 'screen-2': return <Screen2Situation key="s2" {...props} />;
      case 'screen-2b': return <Screen2BConfirmation key="s2b" {...props} />;
      case 'screen-3': return <Screen3Education key="s3" {...props} />;
      case 'screen-4': return <Screen4Size key="s4" {...props} />;
      case 'screen-5': return <Screen5Pricing key="s5" {...props} />;
      case 'screen-6': return <Screen6Plan key="s6" {...props} />;
      case 'screen-7': return <Screen7Tier key="s7" {...props} />;
      case 'screen-date': return <Screen8Date key="sdate" {...props} />;
      case 'screen-lead': return <Screen9Lead key="slead" {...props} />;
      case 'screen-addons': return <Screen10Addons key="saddons" {...props} />;
      case 'screen-review': return <Screen11Review key="sreview" {...props} />;
      case 'screen-flex': return <ScreenFlexHandoff key="sflex" {...props} />;
      case 'screen-success': return <ScreenSuccess key="ssuccess" {...props} />;
      default: return <Screen1Intent key="s1" {...props} />;
    }
  }

  return (
    <FlowContext.Provider value={contextValue}>
      <div className="min-h-screen bg-warm flex items-center justify-center p-4">
        <div
          className="w-full max-w-[430px] min-h-[780px] bg-white rounded-[40px] shadow-[0_30px_80px_rgba(0,0,0,0.18),0_0_0_1px_rgba(0,0,0,0.06)] flex flex-col relative"
          style={{ overflow: currentScreen === 'screen-success' ? 'hidden' : undefined }}
          data-testid="phone-frame"
        >
          {showProgress && (
            <ProgressBar current={Math.max(currentIdx, 0)} total={totalScreens - 1} />
          )}
          {showNav && (
            <TopNav
              canGoBack={screenStack.length > 1}
              onBack={goBack}
            />
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
