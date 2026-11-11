'use client';

import ToolsSection from './ToolsSection';

const images = [
  { src: '/icones/nodejs1.svg' },
  { src: '/icones/typescript2.png' },
  { src: '/icones/php.png' },
  { src: '/icones/mySQL.png' },
  { src: '/icones/mongodb.png' },
  { src: '/icones/docker.png' },
  { src: '/icones/postman.png' },
  { src: '/icones/sequelize.png' }
];

export default function BackEnd() {
  return (
    <ToolsSection
      titleKey="backendTitle"
      descriptionPrefix="backendDescription"
      stepCount={5}
      images={images}
      altPrefix="logo tech"
      stepNumber={2}
    />
  );
}
