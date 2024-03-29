import React, {memo} from 'react';
import {View} from 'react-native';
import colors from '../../constants/colors';

import Text from './Text';
import {Muscle} from '../../types/Exercise';
import {
  backMuscles,
  frontMuscles,
  muscleReadableString,
} from '../../helpers/exercises';
import Svg, {Path} from 'react-native-svg';
import MuscleFill from './MuscleFill';

const DefaultPath: React.FC<{d: string}> = ({d}) => {
  return (
    <Path
      fill="none"
      stroke={colors.textGrey}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={0.2}
      d={d}
    />
  );
};

const MusclesDiagram: React.FC<{primary?: Muscle[]; secondary?: Muscle[]}> = ({
  primary,
  secondary,
}) => {
  const front = (primary || []).filter(m => frontMuscles.includes(m));

  const frontSecondary = (secondary || []).filter(m =>
    frontMuscles.includes(m),
  );

  const back = (primary || []).filter(m => backMuscles.includes(m));

  const backSecondary = (secondary || []).filter(m => backMuscles.includes(m));

  const hasFront = !!front.length || !!frontSecondary.length;
  const hasBack = !!back.length || !!backSecondary.length;

  return (
    <View style={{}}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 20,
          paddingVertical: 10,
          flexDirection: 'row',
          borderRadius: 10,
        }}>
        {hasFront && (
          <Svg width="50%" height={200} viewBox="0 0 12.62 47.06">
            {front.map(m => (
              <MuscleFill key={m} muscle={m} />
            ))}
            {frontSecondary.map(m => (
              <MuscleFill key={m} muscle={m} secondary />
            ))}
            <DefaultPath d="M9.13,22l.1-.32s0-.45.2-.59.87-.45.79-.12c0,0,.22,1.83.22,2.4A24,24,0,0,1,10,27c-.26.39-.21-1-.31-1.2C9.64,25.27,9.6,24.28,9.13,22Z" />
            <DefaultPath d="M3.46,21.92a15.55,15.55,0,0,0-.39,1.95c-.26,1.28-.2,1.88-.32,2.16s0,.74-.2.93-.14-.7-.19-1.09A15.68,15.68,0,0,1,2.2,22c.2-1.58.12-1.24.31-1.22s.82.18.79.61S3.46,21.92,3.46,21.92Z" />
            <DefaultPath d="M2.46,12c-.16.13-.1.34-.12.5,0,.45-.1.9-.16,1.36s-.1,1.16-.18,1.74a6.73,6.73,0,0,0,0,1.1,8.13,8.13,0,0,1,0,1.56c-.06.56-.11,1.11-.19,1.66s-.16,1.1-.25,1.66a10.46,10.46,0,0,0-.2,2.23,3.63,3.63,0,0,0,.4,1.59,1.39,1.39,0,0,1,.09.94,4.65,4.65,0,0,0-.08,1.05c0,.13,0,.23-.16.27" />
            <DefaultPath d="M9.89,12.21c.11.2,0,.38-.05.56-.15.5-.17,1-.31,1.52s-.18.84-.28,1.26c-.06.26-.07.55-.12.82a3.59,3.59,0,0,0,.46,2.34,5,5,0,0,1,.49,1.15,5.2,5.2,0,0,1,.12.87c0,.27.06.54.1.81q.09.66.12,1.32c0,.44,0,.88,0,1.32a6.3,6.3,0,0,1-.12,1c-.06.4-.09.81-.16,1.21a1.47,1.47,0,0,1-.17.74s0,.09,0,.13a11.79,11.79,0,0,1-.18,1.57c-.06.51-.14,1-.23,1.52-.12.66-.27,1.32-.4,2a6.07,6.07,0,0,0-.16.83c0,.24,0,.49,0,.73a3.55,3.55,0,0,0,0,.86.27.27,0,0,1,0,.19,4.48,4.48,0,0,0-.65,1.64,11.09,11.09,0,0,0-.32,2.37,21.9,21.9,0,0,0,.13,3.24c0,.27.07.54.1.81a.24.24,0,0,0,.09.18" />
            <DefaultPath d="M2.82,25.9c-.12.13-.08.3-.11.45s0,.46-.16.65c0,0,0,0,0,.06,0,.46.07.92.14,1.37s.13.92.22,1.39.18,1.13.3,1.7.26,1.16.35,1.74a5.32,5.32,0,0,1,0,.89c0,.24,0,.48,0,.72s-.09.43-.12.65c-.06.51-.17,1-.21,1.54a6.85,6.85,0,0,0,0,.79,11,11,0,0,0,.33,2c.18.73.37,1.46.49,2.2.06.34.07.7.14,1a5.5,5.5,0,0,1,0,1.15,1.56,1.56,0,0,1-.42.85c-.21.25-.41.5-.61.76s-.25.6.14.82a1.73,1.73,0,0,0,1.47.19A.93.93,0,0,0,5.28,46a.37.37,0,0,1,.2-.39c.31-.17.35-.27.29-.62a.93.93,0,0,0-.16-.51c-.08-.1,0-.21,0-.32a13.24,13.24,0,0,1-.16-2c0-.2,0-.4,0-.6s-.11-.31-.11-.49c0-.82-.09-1.63-.05-2.44,0-.42,0-.84.05-1.25,0-.57.08-1.14.14-1.7a.25.25,0,0,1,0-.12" />
            <DefaultPath d="M5.88,24.31c.06.29.16.58.19.87,0,.09,0,.17,0,.25,0,.52,0,1.05,0,1.57S6,28,6,28.52a4.68,4.68,0,0,0-.07,1.18,6.3,6.3,0,0,1,0,1.68,11.51,11.51,0,0,1-.23,1.43c0,.2,0,.4,0,.61a7.78,7.78,0,0,0-.09,2,4.07,4.07,0,0,0,.15.51c.07.57.13,1.15.2,1.72a7.69,7.69,0,0,1,0,1.73c-.06.48-.16,1-.25,1.45a1.37,1.37,0,0,1-.15.6" />
            <DefaultPath d="M9.06,35a3.29,3.29,0,0,1,.15.83,13,13,0,0,1,.21,1.76,6.74,6.74,0,0,1-.09,1.19c-.17,1.1-.53,2.17-.72,3.27,0,.26-.09.53-.12.8a7.17,7.17,0,0,0-.07.81A2.68,2.68,0,0,0,9,45.36c.16.2.33.37.5.56s.26.56-.07.75a1.72,1.72,0,0,1-1.57.23A.85.85,0,0,1,7.25,46a.36.36,0,0,0-.2-.36c-.33-.2-.42-.34-.29-.72A5.62,5.62,0,0,0,7,43.77a10.35,10.35,0,0,0,.08-1.47,2.6,2.6,0,0,1,0-.56c0-.16-.08-.3-.11-.45-.1-.66-.24-1.32-.32-2a8.48,8.48,0,0,1,0-1.95c.06-.55.15-1.1.23-1.65a.3.3,0,0,1,.08-.18" />
            <DefaultPath d="M8.1,33.89c0-.51.05-1,.1-1.53.08-.67.19-1.34.3-2s.26-1.4.43-2.1A11.08,11.08,0,0,1,9.6,26a1.17,1.17,0,0,0,.1-.72c-.09-.61-.19-1.22-.29-1.83A12.84,12.84,0,0,0,9.13,22v-.08" />
            <DefaultPath d="M2.86,25.9A4.8,4.8,0,0,1,3.19,27c.28,1,.52,2.05.74,3.08a22.82,22.82,0,0,1,.44,2.71c0,.36,0,.72.08,1.07" />
            <DefaultPath d="M2.42,20.78a2.32,2.32,0,0,1,.78.33.21.21,0,0,1,.09.18.92.92,0,0,0,.36.81c.15.1.12.27.16.42.08.34.19.67.28,1,.23.77.46,1.53.67,2.3.15.54.27,1.1.43,1.63s.27,1,.45,1.5c.06.17,0,.38.2.5" />
            <DefaultPath d="M8.77,22.32a1.14,1.14,0,0,1-.12.58C8.32,23.92,8,25,7.72,26c-.14.47-.23,1-.38,1.43s-.28,1-.47,1.57c0,.14,0,.32-.18.42" />
            <DefaultPath d="M8.16,16.77A2.7,2.7,0,0,0,7.6,15a2.24,2.24,0,0,0-1-.55,1,1,0,0,0-.76,0,2,2,0,0,0-1.16.85,4.08,4.08,0,0,0-.36,1.5c-.05.53-.07,1.06-.11,1.59a12.27,12.27,0,0,0,0,2.57,5.78,5.78,0,0,0,.5,1.75c.08.16.19.29.28.44s.19.14.31.16a2.89,2.89,0,0,0,1,.2,6.45,6.45,0,0,0,1.07-.27c.15,0,.19-.21.27-.33a4.31,4.31,0,0,0,.61-1.75,9,9,0,0,0,.08-2c-.05-.77-.08-1.54-.15-2.3" />
            <DefaultPath d="M5.14,27.56a2,2,0,0,0-.1.74c-.1,1.07-.18,2.15-.21,3.24,0,.7-.08,1.4-.06,2.1,0,0,0,.11,0,.16" />
            <DefaultPath d="M2.85,13.22c-.09.12,0,.25,0,.35.16.62.27,1.25.41,1.86a8,8,0,0,1,.2,1.46,4.11,4.11,0,0,1-.28,1.32,3.61,3.61,0,0,1-.35.71,3.54,3.54,0,0,0-.44,1.46c-.05.43-.11.86-.16,1.29a11,11,0,0,0-.1,1.14,14.09,14.09,0,0,0,0,1.84c.07.5.14,1,.2,1.5,0,.18,0,.37.07.56a.31.31,0,0,0,.09.22" />
            <DefaultPath d="M3.53,34.94a2,2,0,0,1,.36.72,8.79,8.79,0,0,1,.58,2.63,15.23,15.23,0,0,1,0,2.24c0,.72-.1,1.43-.19,2.15a1.45,1.45,0,0,1-.1.58" />
            <DefaultPath d="M12.46,19.11c.13,0,.11-.12.11-.21a3.86,3.86,0,0,0-.15-1c-.13-.58-.31-1.15-.4-1.74a7.21,7.21,0,0,1,0-1.23A10.65,10.65,0,0,0,12,12.81a3.2,3.2,0,0,1,0-.62c0-.51,0-1,0-1.52a3.12,3.12,0,0,0-1.19-2.3A1.54,1.54,0,0,0,10,8.11a6.09,6.09,0,0,0-.74,0A1.41,1.41,0,0,1,7.79,7a1.51,1.51,0,0,1-.1-.38c0-.06,0-.14-.13-.1" />
            <DefaultPath d="M7.38,27.51a2.85,2.85,0,0,1,.11.76q.1,1.11.18,2.22c0,.35,0,.7,0,1.05,0,.75.08,1.5,0,2.26" />
            <DefaultPath d="M8,4.58a.22.22,0,0,0,.29-.09,1.77,1.77,0,0,0,.35-.94c0-.08,0-.27-.19-.27s-.06-.1-.05-.15A5.85,5.85,0,0,0,8.5,1.81a1.61,1.61,0,0,0-1-1.55A3.05,3.05,0,0,0,4.74.51,1.56,1.56,0,0,0,4,1.85,8.51,8.51,0,0,0,4.1,3.09a1.15,1.15,0,0,0,.17.49,1.94,1.94,0,0,1,.13.54,4.42,4.42,0,0,0,.43,1.2.75.75,0,0,1,.1.45,1.61,1.61,0,0,0,0,.69" />
            <DefaultPath d="M12.5,19.15a11.31,11.31,0,0,1-.19,2l-.15,1.36c-.06.61-.14,1.21-.17,1.82a4,4,0,0,0,.2,1.29c.07.26.11.53.2.78a1,1,0,0,1-.18.92c-.13.22-.29.42-.4.65a.29.29,0,0,1-.29.14c-.23,0-.46.05-.67-.09" />
            <DefaultPath d="M10.16,20.78a3.55,3.55,0,0,0-.65.22c-.15.08-.26.17-.25.36a1.09,1.09,0,0,1-.45.87,3.81,3.81,0,0,0-.64.81,3.11,3.11,0,0,1-1.26,1.07.66.66,0,0,0-.37.58,6.41,6.41,0,0,0-.12,1.9c0,.35,0,.7.06,1.06.07.58.06,1.16.18,1.74A2.24,2.24,0,0,1,6.6,30a7.28,7.28,0,0,0,.06,1.68,9,9,0,0,1,.17,1.14A18.89,18.89,0,0,1,7,34.92a1.46,1.46,0,0,1,0,.29c-.07.2.09.36.11.56,0,.56.11,1.13.13,1.7s.08,1.38.07,2.08,0,1.18-.09,1.76a.24.24,0,0,1-.09.18" />
            <DefaultPath d="M10.11,12c0,.05.08.09.09.14.05.41.09.83.13,1.25l.12,1c.05.44.11.87.13,1.3a10.76,10.76,0,0,1,0,1.39,5,5,0,0,0,0,1.45c.13.56.11,1.12.19,1.68.11.74.21,1.47.29,2.21,0,.38.1.76.14,1.14a3.37,3.37,0,0,1-.3,1.66,2.37,2.37,0,0,0-.21.58,2.76,2.76,0,0,0,.06.76c.06.31,0,.63.08.94,0,.09,0,.16.11.2" />
            <DefaultPath d="M4.92,6.48c-.13.17-.11.38-.17.57A1.6,1.6,0,0,1,3.58,8.13a.91.91,0,0,1-.4,0,1.89,1.89,0,0,0-1,.09,1.83,1.83,0,0,0-.95.85A3.58,3.58,0,0,0,.63,11c0,.45,0,.91.05,1.36,0,.25-.06.48-.07.72s0,.22,0,.33c0,.79,0,1.58,0,2.38a5,5,0,0,1-.23,1.43,5.5,5.5,0,0,0-.33,1.65c0,.56.07,1.12.16,1.68.07.41.11.83.15,1.25s.09.66.12,1,.06.74.11,1.11a6.21,6.21,0,0,1-.34,2.42,1.32,1.32,0,0,0,.16,1.07c.11.21.25.39.37.59a.34.34,0,0,0,.36.18,2.67,2.67,0,0,1,.4,0c.11,0,.24,0,.26-.1s.11-.26-.06-.35" />
            <DefaultPath d="M3.44,22a2.82,2.82,0,0,0-.19.86c-.12.59-.2,1.19-.3,1.78-.05.34-.09.67-.13,1a.34.34,0,0,0,0,.26" />
            <DefaultPath d="M7.63,6.53c0-.31,0-.61,0-.92s.1-.35.18-.51a4.44,4.44,0,0,0,.38-1.37,3.24,3.24,0,0,0,0-.82,2.39,2.39,0,0,0-.39-1.15,4.61,4.61,0,0,0-.48-.51c-.08-.08-.2,0-.29,0A6.48,6.48,0,0,0,5.15,2a1.57,1.57,0,0,0-.79,1.37.22.22,0,0,1-.07.2" />
            <DefaultPath d="M2.73,12.08a2.52,2.52,0,0,0,.58.81,1.63,1.63,0,0,0,2.53-.5l0-.09" />
            <DefaultPath d="M10.62,11.29a6,6,0,0,1-.47.38.15.15,0,0,0-.06.14" />
            <DefaultPath d="M9.86,12.19c-.09,0-.12.14-.18.22a1.77,1.77,0,0,1-1.16.83,1.52,1.52,0,0,1-1.68-.65,3,3,0,0,1-.2-.29" />
            <DefaultPath d="M7.58,5.63c-.2.12-.29.33-.47.48-.65.54-1.06.47-1.72-.05-.16-.12-.23-.33-.42-.4" />
            <DefaultPath d="M1.79,27.94c-.26-.09-.3-.33-.31-.54a6.89,6.89,0,0,0-.09-1,.34.34,0,0,0-.15-.26,1.62,1.62,0,0,0-.48.8.35.35,0,0,0,.07.27c.07.12.14.25.2.38s.26.22.54.13" />
            <DefaultPath d="M3.82,22.34a2,2,0,0,1,.56.7,3.74,3.74,0,0,0,1.46,1.22c.14.08.33,0,.49,0a.93.93,0,0,1,.29,0" />
            <DefaultPath d="M6.29,15.21a.42.42,0,0,0,0,.22c0,1.84,0,3.67,0,5.5,0,.84,0,1.68,0,2.51" />
            <DefaultPath d="M1.14,17.07a4.33,4.33,0,0,0-.89,1.81c0,.09,0,.19-.14.24" />
            <DefaultPath d="M5,6.53a2.69,2.69,0,0,1,.19.74,2.52,2.52,0,0,0,.57,1.25.27.27,0,0,1,0,.13" />
            <DefaultPath d="M8.63,8.52a8.38,8.38,0,0,0,1.59,2.24c.45.49,1,.9,1.39,1.43a1,1,0,0,0,.27.24" />
            <DefaultPath d="M3.89,8.52A5.83,5.83,0,0,1,3,10a19.94,19.94,0,0,1-1.52,1.66,4.33,4.33,0,0,0-.59.62c0,.06-.09.12-.17.11" />
            <DefaultPath d="M7.56,6.57c-.13.34-.17.7-.29,1A2.44,2.44,0,0,1,6.33,9" />
            <DefaultPath d="M11.21,26.55c-.15.16,0,.36-.09.54a3,3,0,0,0,0,.31c0,.06,0,.14.06.15a.13.13,0,0,0,.18-.08.88.88,0,0,0-.05-.87c-.17-.18-.1-.31,0-.47a1.31,1.31,0,0,1,.51.82c.05.17-.11.32-.19.47-.18.36-.24.38-.62.32" />
            <DefaultPath d="M8.3,18.88a9.5,9.5,0,0,1-1.77.2,10.16,10.16,0,0,1-2.06-.15c-.07,0-.12-.09-.2-.05" />
            <DefaultPath d="M11.47,17.07a4.82,4.82,0,0,1,.9,1.83.56.56,0,0,0,.07.16" />
            <DefaultPath d="M4.29,20.93a1.68,1.68,0,0,0,.72.16c.41,0,.82.05,1.23,0" />
            <DefaultPath d="M9,8.14a.85.85,0,0,1-.58.38c-.53.13-1.07.06-1.59.15,0,0,0,0,0,0" />
            <DefaultPath d="M6.42,12.88a11,11,0,0,0,1.86,1" />
            <DefaultPath d="M3.58,8.16a.85.85,0,0,0,.56.36,7.81,7.81,0,0,0,1.45.11c.26,0,.4.22.61.32" />
            <DefaultPath d="M8.14,16.77a1.86,1.86,0,0,1-.62.09c-.41,0-.82,0-1.23,0" />
            <DefaultPath d="M4.41,16.8a11.16,11.16,0,0,0,1.83.06" />
            <DefaultPath d="M6.15,12.88a18.42,18.42,0,0,1-1.83,1" />
            <DefaultPath d="M.72,15.88a3.81,3.81,0,0,1,.24.67c.23.58.49,1.14.7,1.72.06.17,0,.37.17.52" />
            <DefaultPath d="M11.92,15.9c-.16.14-.15.34-.22.52-.23.58-.51,1.15-.72,1.74-.05.13-.09.27-.13.4s0,.2-.14.25" />
            <DefaultPath d="M4.05,3.24c-.19,0-.27.11-.25.29a2.68,2.68,0,0,0,.32.87.3.3,0,0,0,.35.18" />
            <DefaultPath d="M10,10.65a4.58,4.58,0,0,1-.74.13,5.55,5.55,0,0,1-.8.13" />
            <DefaultPath d="M6.29,9.39v3" />
            <DefaultPath d="M9.69,13.2c-.13,0-.16.15-.22.24a1.25,1.25,0,0,1-.75.54c-.14,0-.25,0-.38-.05" />
            <DefaultPath d="M10,11.94a.47.47,0,0,0-.38,0,9.75,9.75,0,0,1-1.05.45" />
            <DefaultPath d="M4.05,12.43A7.25,7.25,0,0,1,3,12a.42.42,0,0,0-.31-.05" />
            <DefaultPath d="M2.68,11.94a.1.1,0,0,1-.15-.07c-.11-.28-.38-.39-.58-.58" />
            <DefaultPath d="M8.39,43.77a.19.19,0,0,1-.18-.09.7.7,0,0,0-1.05,0l-.11.09" />
            <DefaultPath d="M5.48,43.8a2.73,2.73,0,0,1-.25-.23.6.6,0,0,0-.82,0c-.07,0-.13.13-.23.13" />
            <DefaultPath d="M10.62,15.75c.09,0,.11.09.14.15a4.67,4.67,0,0,0,.67,1" />
            <DefaultPath d="M2.59,12a2.1,2.1,0,0,0,.25,1.12c.22.38.47.82,1,.89a.7.7,0,0,0,.4-.07" />
            <DefaultPath d="M10,27.09,9.93,27a1.1,1.1,0,0,1-.07-.36,3.22,3.22,0,0,0-.13-.87l0-.52" />
            <DefaultPath d="M7.94,3c-.29-.31-.63-.21-1-.11A1.84,1.84,0,0,1,6.73,3" />
            <DefaultPath d="M5.84,3c-.2,0-.38-.15-.58-.18a.67.67,0,0,0-.63.2" />
            <DefaultPath d="M1.92,15.77c-.14.09-.16.27-.24.4a4.44,4.44,0,0,1-.52.76" />
            <DefaultPath d="M1.36,26.55a.89.89,0,0,0-.11.94c.06.1.13.07.2,0" />
            <DefaultPath d="M8.23,21a6.66,6.66,0,0,1-1.94.18" />
            <DefaultPath d="M9,33.17c-.12,0-.11.16-.16.25-.32.63-.83.59-1.32.26a1.52,1.52,0,0,1-.42-.55A.67.67,0,0,0,6.93,33" />
            <DefaultPath d="M5.61,32.92c-.14.07-.15.23-.22.34a1.19,1.19,0,0,1-.65.58.69.69,0,0,1-.92-.29c-.07-.09-.08-.23-.22-.27" />
            <DefaultPath d="M2.55,10.65c.31.08.63.1.94.18.13,0,.27,0,.38.08" />
            <DefaultPath d="M9.77,10.87a2.09,2.09,0,0,1,.09.78c0,.08.05.12.07.18" />
            <DefaultPath d="M2.8,10.87a2.32,2.32,0,0,0-.09.78c0,.08,0,.12-.07.18" />
            <DefaultPath d="M7.49.29c-.07.26-.08.54-.17.81,0,0-.07.07-.05.13" />
            <DefaultPath d="M5.88,5.5a.74.74,0,0,0,.81,0" />
            <DefaultPath d="M5.84,4.7c.1.1.26.06.38.09s.28-.06.42-.09" />
            <DefaultPath d="M6.64,5.3A.53.53,0,0,0,6,5.24a.25.25,0,0,1-.32,0" />
            <DefaultPath d="M1.34,24.4a5.3,5.3,0,0,0-.69,0" />
            <DefaultPath d="M11.27,24.4c.23,0,.45,0,.67,0" />
            <DefaultPath d="M6,5.32a3.86,3.86,0,0,0,1,0" />
            <DefaultPath d="M5.14,3.17a.33.33,0,0,0-.33.12,1.07,1.07,0,0,0,1,.08.73.73,0,0,0-.6-.2" />
            <DefaultPath d="M8.41,3.31c-.09.09-.05.24-.18.31" />
            <DefaultPath d="M7.78,3.29a.78.78,0,0,0-1,.08c.14.06.26.15.41,0" />
            <DefaultPath d="M10.87,27.65c-.16.07-.16.19-.09.33" />
            <DefaultPath d="M7.9,3.26c-.16,0-.27.14-.45.16s-.26,0-.31-.18" />
            <DefaultPath d="M6.93,44.51c.09.07.08.23.21.27" />
            <DefaultPath d="M5.55,44.56c0,.06-.07.15-.16.18" />
            <DefaultPath d="M8.3,11.76c-.11.06-.2.14-.18.27a.25.25,0,0,0,.18.18.24.24,0,0,0,.31-.16.26.26,0,0,0-.2-.29H8.32" />
            <DefaultPath d="M4.09,11.76a.29.29,0,0,0-.17.27.24.24,0,0,0,.2.18c.16,0,.27,0,.29-.18s-.07-.26-.29-.27" />
          </Svg>
        )}
        {hasBack && (
          <Svg width="50%" height={200} viewBox="0 0 12.62 47.06">
            {back.map(m => (
              <MuscleFill key={m} muscle={m} back />
            ))}
            {backSecondary.map(m => (
              <MuscleFill key={m} muscle={m} secondary back />
            ))}
            <DefaultPath d="M10.29,12.13a1.68,1.68,0,0,0-.23.75c-.18.85-.35,1.71-.53,2.56a10.66,10.66,0,0,0-.2,1.26,1,1,0,0,1-.05.18A2.56,2.56,0,0,0,9.44,18a6.39,6.39,0,0,0,.66,1.49,3.13,3.13,0,0,1,.28,1.09c.06.42.14.83.21,1.24.1.62.18,1.25.26,1.87a9.89,9.89,0,0,1-.25,2.66A12.56,12.56,0,0,1,10.28,28c-.2.77-.25,1.57-.42,2.36s-.28,1.52-.45,2.28c-.09.41-.15.82-.21,1.24a4.4,4.4,0,0,0,.14,1.69,10.61,10.61,0,0,1,.4,2.74,8.3,8.3,0,0,1-.34,2c-.22.85-.45,1.7-.62,2.56l-.3,1.62c0,.07,0,.11,0,.16" />
            <DefaultPath d="M8.19,29.64a.91.91,0,0,0-.11.53,6.86,6.86,0,0,1-.38,1.67,5.62,5.62,0,0,1-.51,1.27A1.56,1.56,0,0,0,7,34.4a4.68,4.68,0,0,1-.06,2A15,15,0,0,0,6.76,38a7.13,7.13,0,0,0,0,1c0,.39.07.78.1,1.17s.07,1,.12,1.48c.07.7.08,1.41.12,2.11a6.32,6.32,0,0,1,0,.87C7,45.31,7,46,7,46.59a.23.23,0,0,0,.16.27A2.37,2.37,0,0,0,8.23,47a.51.51,0,0,0,.28-.13,9,9,0,0,0,1-.92c.26-.28.37-.4,0-.81a1.15,1.15,0,0,0-.82-.51c-.26,0-.36.08-.34.34a3.4,3.4,0,0,1,0,.78" />
            <DefaultPath d="M2.72,28.6c.07.16,0,.31,0,.47.08.68.19,1.36.3,2s.19,1.06.3,1.6a11.24,11.24,0,0,1,.2,1.16,5.53,5.53,0,0,1,0,1.15c-.11.9-.34,1.79-.41,2.7a5.39,5.39,0,0,0,.15,1.87c.17.69.34,1.38.53,2.06s.37,1.5.51,2.26c0,.2.06.4.1.6,0,0,0,.08,0,.11" />
            <DefaultPath d="M7.7,5.47a10.92,10.92,0,0,0,.16,1.28,1.59,1.59,0,0,0,1.26,1.3,5.06,5.06,0,0,0,.87,0,2,2,0,0,1,.85.18,2.5,2.5,0,0,1,1,1.19,3.45,3.45,0,0,1,.34,1.65,13.28,13.28,0,0,0,0,1.41,17,17,0,0,1,.1,2c0,.46,0,.93-.08,1.39a2.84,2.84,0,0,0,.1.64c.09.64.33,1.25.46,1.88a3.64,3.64,0,0,1,.05,1.14c-.07.56-.13,1.11-.21,1.67s-.11.92-.17,1.37-.07.64-.1,1-.07.87-.09,1.31a5.45,5.45,0,0,0,.29,1.55,6.29,6.29,0,0,0,.17.62c0,.16,0,.28-.1.41a6.14,6.14,0,0,1-.53.89.41.41,0,0,1-.45.2,4,4,0,0,1-.78-.15" />
            <DefaultPath d="M2.51,12.13a1.08,1.08,0,0,0-.09.48c-.13,1-.22,1.9-.33,2.85a11.66,11.66,0,0,0,0,1.56A12.31,12.31,0,0,1,2,19.21a14.87,14.87,0,0,1-.23,1.63,9,9,0,0,0-.12,1c-.1.5-.16,1-.21,1.53A10.06,10.06,0,0,0,1.33,25a1.1,1.1,0,0,0,.16.53.75.75,0,0,1-.06.86,9.47,9.47,0,0,0-.54,1.11.24.24,0,0,0,0,.23c.08.13.15.27.23.41a.21.21,0,0,0,.32.07" />
            <DefaultPath d="M4.55,24.75c.1,1.22,0,2.45,0,3.68q0,.34,0,.69a3.22,3.22,0,0,0,.11.5,7.54,7.54,0,0,0,.47,2.29.19.19,0,0,1,0,.18,2,2,0,0,0-.39,1.14.59.59,0,0,1-.07.16" />
            <DefaultPath d="M10.11,28.27a2.39,2.39,0,0,1-.06-.8,13.62,13.62,0,0,0-.13-1.42A1.23,1.23,0,0,0,9,25l-.46-.14c-.23-.05-.27,0-.3.23-.07.76,0,1.51,0,2.27,0,.57,0,1.15,0,1.73s.14.83.17,1.24a6.76,6.76,0,0,0,.37,1.73,1.74,1.74,0,0,0,.55.88" />
            <DefaultPath d="M.46,17.2a4.09,4.09,0,0,0-.28.92,4.63,4.63,0,0,0,0,2c.06.54.13,1.07.2,1.6s.12.95.16,1.42a8.77,8.77,0,0,1,.1,2.11,9.61,9.61,0,0,1-.35,1.5,1.1,1.1,0,0,0,.15,1c.14.23.29.45.43.69a.28.28,0,0,0,.32.16c.18,0,.38.05.55-.07" />
            <DefaultPath d="M1.46,28.11a.6.6,0,0,1-.09-.43,1.36,1.36,0,0,0-.18-.74" />
            <DefaultPath d="M10.47,11.07c-.1.29-.07.61-.18.89a.12.12,0,0,0,0,.09c.21.27.15.6.2.9.08.5.13,1,.18,1.51s.07.9.13,1.35,0,.91,0,1.37a3,3,0,0,1,0,.43,16.15,16.15,0,0,0,.12,2,6.25,6.25,0,0,0,.15,1.14c.15.58.09,1.18.21,1.77.09.43.12.88.18,1.32a3.31,3.31,0,0,1-.13,1.65,2.64,2.64,0,0,1-.25.66.37.37,0,0,0,0,.19,6.53,6.53,0,0,1,.17,1.53c0,.11,0,.24.16.3s.26.07.41-.14a.82.82,0,0,0,0-1.15" />
            <DefaultPath d="M3.76,9.13c-.19.09-.26.29-.38.43-.33.42-.68.83-1,1.22.06.43.18.83.21,1.25,0,.17.11.35.15.53.21,1,.42,2,.61,2.95.09.46.17.91.25,1.37a2.26,2.26,0,0,1-.11.85,4.47,4.47,0,0,1-.57,1.44,4,4,0,0,0-.48,1.69c0,.42-.1.84-.16,1.26a13,13,0,0,0-.15,2.49c0,.61.13,1.21.22,1.81s.19,1.26.28,1.9c0,.07,0,.17.09.22" />
            <DefaultPath d="M10.22,8.12a.9.9,0,0,1-.48.59,2.22,2.22,0,0,0-.9,1.17c-.29.73-.65,1.43-1,2.13a7.1,7.1,0,0,0-.69,2.9,5,5,0,0,0,1.22,3.41c.05.06.08.13.17.14" />
            <DefaultPath d="M4.94,11.74a4.61,4.61,0,0,1,1,2.83c0,.19,0,.38,0,.57a3.41,3.41,0,0,1-.41,1.74,7,7,0,0,1-1.08,1.56" />
            <DefaultPath d="M8.16,33.35c0,.66,0,1.32,0,2s0,1.11,0,1.67c0,.79-.08,1.58-.11,2.37a2.81,2.81,0,0,0,0,.58,4.2,4.2,0,0,0,.21.66,1.53,1.53,0,0,0,.75.94" />
            <DefaultPath d="M4.69,33.44c0,.52,0,1.05,0,1.58,0,1.09,0,2.19.07,3.29,0,.6,0,1.2,0,1.81" />
            <DefaultPath d="M6.48,27c0,.07,0,.19,0,.27,0,.32,0,.64,0,1,0,.64.08,1.27.14,1.9,0,.24,0,.49,0,.73,0,.51.08,1,.13,1.53,0,.28.05.55.06.83,0,.08,0,.19.06.25" />
            <DefaultPath d="M4.46,45.93a5.68,5.68,0,0,1,0-1c0-.28-.15-.39-.41-.3a2.05,2.05,0,0,0-1,.94c-.1.18,0,.34.16.46s.62.44.94.66a1.27,1.27,0,0,0,.64.3,2.53,2.53,0,0,0,.91,0c.28-.07.34-.18.3-.45-.08-.57-.11-1.15-.16-1.72a6.73,6.73,0,0,1-.07-1c0-.68.07-1.35.13-2,0-.49.07-1,.11-1.48s.06-.81.07-1.22A11.66,11.66,0,0,0,6,37.51c-.07-.66-.18-1.31-.28-2a4,4,0,0,1,.05-1.19,5,5,0,0,0,.09-1c0-.32.06-.65.09-1S6,31.48,6,31c.06-.7.1-1.4.15-2.1,0-.44.07-.88.08-1.33,0-.21.09-.4.09-.61" />
            <DefaultPath d="M6.48,27c0-.4,0-1.47,0-1.58a1.73,1.73,0,0,1,.35-.82" />
            <DefaultPath d="M4.46,18.51c-.22.24-.51.4-.74.63a3.56,3.56,0,0,0-1,2.38,10.9,10.9,0,0,1-.14,1.9c-.06.26-.13.51-.43.6" />
            <DefaultPath d="M8.6,18.6c.23.28.56.45.8.73a3.14,3.14,0,0,1,.82,1.83c.09.7,0,1.42.14,2.12.05.29.1.59.41.74h.07" />
            <DefaultPath d="M7.27,1.77c-.07.13,0,.25,0,.38A4.82,4.82,0,0,1,6.91,4.1a12.28,12.28,0,0,0-.54,1.3,4.92,4.92,0,0,0-.17.85.48.48,0,0,1-.07.2" />
            <DefaultPath d="M6,7.69a.41.41,0,0,1,.11-.23A2.93,2.93,0,0,0,7,6.12a1.15,1.15,0,0,1,.62-.66.49.49,0,0,0,.18-.17,4.23,4.23,0,0,0,.37-1c.1-.34.24-.68.32-1a3.87,3.87,0,0,0,0-1.76A1.74,1.74,0,0,0,7.47.26,2.67,2.67,0,0,0,5,.49,1.65,1.65,0,0,0,4.21,1.9a5.05,5.05,0,0,0,.08,1,.45.45,0,0,1,0,.28C4,3.26,4,3.4,4,3.66a2.42,2.42,0,0,0,.27.69c.08.13.17.26.36.18" />
            <DefaultPath d="M4.3,3.23a10.9,10.9,0,0,1,.4,1.3A2,2,0,0,0,5,5.27a.39.39,0,0,1,.06.29c0,.26,0,.52-.06.78A2.07,2.07,0,0,1,4.3,7.81a1.4,1.4,0,0,1-.78.26,5,5,0,0,1-.55,0A1.87,1.87,0,0,0,1.18,9.13a4,4,0,0,0-.53,1.74c0,.42,0,.85,0,1.28s0,.65-.08,1a2.11,2.11,0,0,0,0,.25c0,.66,0,1.32,0,2a5.58,5.58,0,0,1-.1,1.53c-.07.29.11.53.14.8a2.65,2.65,0,0,0,.26.73,16.44,16.44,0,0,1,.5,1.65,6.74,6.74,0,0,0,.2.89" />
            <DefaultPath d="M6.33,27a7.87,7.87,0,0,0-.1-1.77,1.57,1.57,0,0,0-.33-.64c-.12-.14-.27,0-.39,0-.34.06-.69.1-1,.18a1.81,1.81,0,0,0-1.39.95,2.47,2.47,0,0,0-.16.9c-.05.57-.08,1.15-.12,1.73,0,.09,0,.19-.07.25" />
            <DefaultPath d="M5.44,4.76c-.2-.18-.15-.44-.2-.66a5.39,5.39,0,0,1,0-1.33A1.5,1.5,0,0,1,5.7,1.59a1.07,1.07,0,0,1,1.54.07,1.73,1.73,0,0,1,.37,1.09,8.11,8.11,0,0,1-.36,2.68.67.67,0,0,0,0,.2" />
            <DefaultPath d="M9.19,17.22c-.16.1-.16.28-.22.42a4.94,4.94,0,0,1-1.18,1.82,1.2,1.2,0,0,0-.41.94,1.11,1.11,0,0,1-.79,1.08c-.19.07-.31,0-.44-.1a1.29,1.29,0,0,1-.68-1.18,1,1,0,0,0-.23-.67,8.56,8.56,0,0,1-1.47-2.4c0-.06,0-.14-.14-.16" />
            <DefaultPath d="M6.17,1.4c.23.23.13.52.06.75-.17.57-.36,1.14-.55,1.7a2.23,2.23,0,0,0-.17,1.3A5.29,5.29,0,0,0,6,6.33a1.29,1.29,0,0,1,.14.83.39.39,0,0,0,0,.28" />
            <DefaultPath d="M1.64,11.58c0,.35,0,.71,0,1.07s-.08,1-.11,1.49a2.13,2.13,0,0,1,0,.25.66.66,0,0,0,.1.63,2.32,2.32,0,0,1,.31.74.2.2,0,0,0,.12.16" />
            <DefaultPath d="M6.42,21.55c0,.77-.06,1.55,0,2.33a.55.55,0,0,0,.26.46,2.35,2.35,0,0,0,1,.37,1.92,1.92,0,0,1,.71.15" />
            <DefaultPath d="M11.39,12a.53.53,0,0,0,0,.41c.07.47.1.95.17,1.42,0,.29.07.59.12.89,0,0,0,.06,0,.09A4.92,4.92,0,0,0,11,16.1s0,0,0,0" />
            <DefaultPath d="M4.57,29.32a5.73,5.73,0,0,0-.15,1A11,11,0,0,1,4,31.93a.21.21,0,0,0,0,.26,2.16,2.16,0,0,1,.51,1.09s0,.07.06.11" />
            <DefaultPath d="M2.45,8.17c0,.17.16.21.27.3a2.59,2.59,0,0,0,.78.39.55.55,0,0,1,.34.38,19.46,19.46,0,0,0,.8,1.95,1.61,1.61,0,0,0,.19.31c.14.17.07.3,0,.42a1.21,1.21,0,0,1-.89.27,2.86,2.86,0,0,1-1.15-.28c-.06,0-.09,0-.13,0" />
            <DefaultPath d="M8.05,11.69a1.63,1.63,0,0,0,.68.57A1.55,1.55,0,0,0,10,12.08c.09-.06.16-.13.27-.09" />
            <DefaultPath d="M10.93,17.48c.14.19.21.42.34.62a2.44,2.44,0,0,0,.47.59,11.24,11.24,0,0,0-.47,2s0,.08-.07.12" />
            <DefaultPath d="M9.24,9.2c.25.39.48.81.75,1.19a9.85,9.85,0,0,0,1.36,1.52,2.69,2.69,0,0,0,.79.58" />
            <DefaultPath d="M1.64,25.94a1,1,0,0,1,.09.8,6.25,6.25,0,0,0-.09.87,1.15,1.15,0,0,1-.06.52" />
            <DefaultPath d="M12.35,17.11a2.16,2.16,0,0,0-.21.55,5.11,5.11,0,0,1-.43,1" />
            <DefaultPath d="M8,40.07c-.11.16-.1.36-.18.53a1.9,1.9,0,0,1-.82.93" />
            <DefaultPath d="M4.75,40.16a4.28,4.28,0,0,0-.15.51,2,2,0,0,1-.76,1" />
            <DefaultPath d="M8.53,3.25a.22.22,0,0,1,.21.25,1.92,1.92,0,0,1-.26.89.29.29,0,0,1-.32.17" />
            <DefaultPath d="M4.82,40.14a5.73,5.73,0,0,0,.46.8c.17.21.29.46.57.55" />
            <DefaultPath d="M5.19,32.09c.17.28.23.6.37.89.06.13.07.29.22.37" />
            <DefaultPath d="M11.25,26a2.13,2.13,0,0,0,.43.6.24.24,0,0,1,0,.34,1.35,1.35,0,0,0-.19.76.65.65,0,0,1-.09.45" />
            <DefaultPath d="M2,17.41c-.18.2-.26.47-.43.68a2.79,2.79,0,0,1-.48.55" />
            <DefaultPath d="M1.42,14.85a6.36,6.36,0,0,0-.57.94c-.06.08-.08.18-.19.22" />
            <DefaultPath d="M7.68,32.07a2.51,2.51,0,0,1,.39,1.1.21.21,0,0,0,.07.13" />
            <DefaultPath d="M8.76,32.14c-.23.12-.27.36-.37.57a5.84,5.84,0,0,1-.2.59" />
            <DefaultPath d="M11.68,14.85a6.63,6.63,0,0,1,.36.87.54.54,0,0,0,.15.21" />
            <DefaultPath d="M4,32.14c-.18.18-.22.45-.4.64s-.12.1-.17.16" />
            <DefaultPath d="M2.33,10.84c-.35.28-.61.64-1,.92s-.36.4-.64.48" />
            <DefaultPath d="M12.26,24.47a2.28,2.28,0,0,0-.69,0" />
            <DefaultPath d="M1.28,24.38H.64" />
            <DefaultPath d="M5.14,5.45c.17.07.28.22.44.3s.06,0,.09,0" />
            <DefaultPath d="M11.25,28.06c-.25,0-.33.11-.3.35" />
            <DefaultPath d="M6.42,24.11c-.11.18-.41.26-.54.41" />
          </Svg>
        )}
      </View>
    </View>
  );
};

export default memo(MusclesDiagram);
