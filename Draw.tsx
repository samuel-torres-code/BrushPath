import React, { useState } from "react";
import { View, Button, Dimensions } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Canvas, Path, useSVG, ImageSVG, rect, fitbox, Group } from "@shopify/react-native-skia";
import {kanjiSVGs} from "./joyo_kanji";
import { createInterpolator } from './svg-interpolator';

interface IPath {
  id: string;
  segments: string[];
  color?: string;
}

export default function Draw() {
  const [paths, setPaths] = useState<IPath[]>([]);
  const [currentPathId, setCurrentPathId] = useState<string | null>(null);
  const [lastX, setLastX] = useState<number | null>(null);
  const [lastY, setLastY] = useState<number | null>(null);
  const [kanjiShown, setKanjiShown] = useState<boolean>(false);

  const generatePathId = () => {
    return `path-${Date.now()}`;
  };

  const startPath = (x: number, y: number) => {
    const newPathId = generatePathId();
    setCurrentPathId(newPathId);
    setLastX(x);
    setLastY(y);
    setPaths((prevPaths) => [
      ...prevPaths,
      { id: newPathId, segments: [`M ${x},${y} `], color: "#ffffff" },
    ]);
  };

  const updatePath = (x: number, y: number) => {
    if (
      currentPathId &&
      lastX !== null &&
      lastY !== null
    ) {
      //const distance = Math.sqrt((x - lastX) ** 2 + (y - lastY) ** 2);
      if (true /*distance >= threshold*/) {
        setLastX(x);
        setLastY(y);
        setPaths((prevPaths) =>
          prevPaths.map((path) =>
            path.id === currentPathId
              ? { ...path, segments: [...path.segments, `${x},${y} `] }
              : path
          )
        );
      }
    }
  };

  const clearScreen = () => {
    setPaths([]);
  };

  const toggleKanji = () => {
    setKanjiShown(!kanjiShown);
  }
  const kanji = "何".charCodeAt(0).toString(16).padStart(5, "0");

  const svg = useSVG(kanjiSVGs[kanji]);
  
  const size = 350;
  const viewX = Dimensions.get("screen").width / 2 - size/2;
  const viewY = Dimensions.get("screen").height / 2 - size/2;
  const src = svg ? rect(0, 0, svg.width(), svg.height()) : rect(0, 0, 1, 1);
  const dst = rect(viewX, viewY, size, size);

  const pan = Gesture.Pan()
    .onStart(({ x, y }) => startPath(x, y))
    .onUpdate(({ x, y }) => updatePath(x, y))
    .minDistance(1)
    .onEnd(() => console.log(paths[paths.length - 1].segments.join('')));

    const interpolator = createInterpolator({
      joinPathData: true,
      minDistance: 0.5,
      roundToNearest: 0.25,
      sampleFrequency: 0.001,
    }, '../svg-interpolator/sax-wasm.wasm').then(
      (out) => {
        console.log("Interpolated...")
        const interpaths = out.processSVG(svg);
        console.log(interpaths);
      }
    )

    
    
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={pan}>
        <View style={{ flex: 1, backgroundColor: "#424780" }}>
          <Canvas style={{ flex: 8 }}>
            {kanjiShown && svg && (
              <Group 
                transform={fitbox("contain", src, dst)}
              >
                <ImageSVG svg={svg} />
              </Group>
            )}
            {paths.map((p) => (
              <Path
                key={p.id}
                path={p.segments.join(" ")}
                strokeWidth={10}
                style="stroke"
                strokeJoin="round"
                strokeCap="round"
                color={p.color}
              />
            ))}
          </Canvas>
          <View
            style={{
              position: "absolute",
              bottom: 30,
              left: 70,
              right: 70,
              justifyContent: "center",
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Button
                title="Clear Screen"
                onPress={clearScreen}
                color="#101440"
              />
              <Button
                title={kanjiShown ? "Hide Kanji" : "Show Kanji"}
                onPress={toggleKanji}
                color="#101440"
              />
            </View>
          </View>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
