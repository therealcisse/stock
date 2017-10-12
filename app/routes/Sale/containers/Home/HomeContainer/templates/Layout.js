import React from 'react';

import Logo from './Logo';

export default function Layout({ g, h, paid }) {
  const ratio = 907.781 * h / 34;
  return (
    <div
      id="pg1"
      style={{ WebkitUserSelect: 'none' }}
      dangerouslySetInnerHTML={{
        __html: `
<svg viewBox="0 0 935 1540" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<defs>
<style type="text/css"><![CDATA[
.g1_1{
fill: #E3EAF3;
}
.g2_1{
fill: none;
stroke: #000000;
stroke-width: 1.0694444;
stroke-linecap: butt;
stroke-linejoin: miter;
}
.g3_1{
fill: none;
stroke: #A9A9A9;
stroke-width: 0.7638889;
stroke-linecap: butt;
stroke-linejoin: miter;
stroke-dasharray: 4,4;
}
.g4_1{
fill: none;
stroke: #169CEE;
stroke-width: 1.5277778;
stroke-linecap: butt;
stroke-linejoin: miter;
}
]]></style>
</defs>
<path d="M753.2,394.4l120.7,0l0,31.4l-120.7,0l0,-31.4Z" class="g1_1" />
<path d="M664.6,394.4l88.6,0l0,31.4l-88.6,0l0,-31.4Z" class="g1_1" />
<path d="M476.7,394.4l187.9,0l0,31.4l-187.9,0l0,-31.4Z" class="g1_1" />
<path d="M288.8,394.4l187.9,0l0,31.4l-187.9,0l0,-31.4Z" class="g1_1" />
<path d="M61.1,394.4l227.7,0l0,31.4l-227.7,0l0,-31.4Z" class="g1_1" />
<path d="M305.6,153.3l533.6,0" class="g2_1" />
<path d="M306.1,152.8l0,165.2" class="g2_1" />
<path d="M839.7,152.8l0,165.2" class="g2_1" />
<path d="M305.6,317.5l533.6,0" class="g2_1" />
<path d="M61.1,${519.1 + 32 * g}l817.4,0" class="g3_1" />
<path d="M61.1,${542.6 + 32 * g}l304.5,0" class="g2_1" />
        <path d="M61.6,${542 + 32 * g}l0,102.5" class="g2_1" />
        <path d="M366.1,${542 + 32 * g}l0,102.5" class="g2_1" />
        <path d="M61.1,${643.9 + 32 * g}l304.5,0" class="g2_1" />
${paid
          ? [
              `<path d="M191,${683.2 + 32 * g}l681.8,0" class="g2_1" />`,
              `<path d="M191.5,${682.7 + 32 * g}l0,24.3" class="g2_1" />`,
              `<path d="M873.4,${682.7 + 32 * g}l0,24.3" class="g2_1" />`,
              `<path d="M191,${706.5 + 32 * g}l681.8,0" class="g2_1" />`,
            ].join('')
          : ''}
<path d="M191,${745.7 + 32 * g}l681.8,0" class="g2_1" />
<path d="M191.5,${745.2 + 32 * g}l0,146.6" class="g2_1" />
<path d="M873.4,${745.2 + 32 * g}l0,146.6" class="g2_1" />
<path d="M191,${891.3 + 32 * g}l681.8,0" class="g2_1" />
<image preserveAspectRatio="none" x="38" y="0" width="229" height="196" xlink:href=${Logo} />
<path d="M76.4,1464.4l${264 + 264 + 264},0" class="g4_1" />
<!-- <path d="M${583 - ratio},1464.4l${264 + ratio},0" class="g4_1" /> -->
</svg>


      `,
      }}
    />
  );
}
