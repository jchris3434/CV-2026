'use client';

import ToolsSection from '../BackEnd/ToolsSection';

const images = [
  { src: '/icones/html5.png' },
  { src: '/icones/css3.png' },
  { src: '/icones/JS.png' },
  { src: '/icones/react.png' },
  { src: '/icones/typescript2.png' },
  { src: '/icones/graphql.png' },
  { src: '/icones/vuejs.png' },
  { src: '/icones/pinia.png' },
  { src: '/icones/abtasty.png' },
  { src: '/icones/contentsquare.png' }
];

export default function FrontEnd() {
  return (
    <ToolsSection
      titleKey="frontendTitle"
      descriptionPrefix="frontendDescription"
      stepCount={5}
      images={images}
      reverse
      fullWidth
      altPrefix="logo front"
      stepNumber={3}
    />
  );
}
