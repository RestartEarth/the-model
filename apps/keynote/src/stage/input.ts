import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { stage } from "./engine";

export function useStage() {
  return useSyncExternalStore(stage.subscribe, () => stage.get(), () => stage.get());
}

export function useStageInput() {
  const snapping = useRef(false);

  const bind = useCallback(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      const nextKeys = [" ", "ArrowRight", "PageDown", ".", "Enter"];
      const prevKeys = ["ArrowLeft", "PageUp", "Backspace"];

      if (nextKeys.includes(e.key)) {
        e.preventDefault();
        if (snapping.current) return;
        snapping.current = true;
        stage.next();
        window.setTimeout(() => {
          snapping.current = false;
        }, 120);
      } else if (prevKeys.includes(e.key)) {
        e.preventDefault();
        stage.prev();
      } else if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        stage.togglePause();
      } else if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        stage.toggleMode();
      } else if (e.key === "[") {
        e.preventDefault();
        stage.prev();
      } else if (e.key === "]") {
        e.preventDefault();
        stage.next();
      } else if (
        e.key === "Home" ||
        e.key === "r" ||
        e.key === "R" ||
        e.key === "Escape"
      ) {
        e.preventDefault();
        stage.go(0);
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        stage.jumpAct(-1);
      } else if (e.key === "0") {
        e.preventDefault();
        stage.jumpAct(0);
      } else if (e.key === "1") {
        e.preventDefault();
        stage.jumpAct(1);
      } else if (e.key === "2") {
        e.preventDefault();
        stage.jumpAct(2);
      } else if (e.key === "3") {
        e.preventDefault();
        stage.jumpAct(3);
      } else if (e.key === "4") {
        e.preventDefault();
        stage.jumpAct(4);
      } else if (e.key === "5") {
        e.preventDefault();
        stage.jumpAct(5);
      } else if (e.key === "6") {
        e.preventDefault();
        stage.jumpAct(6);
      }
    };

    const onClick = () => {
      stage.next();
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => bind(), [bind]);
}
