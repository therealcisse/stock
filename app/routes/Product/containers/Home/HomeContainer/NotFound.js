import React from 'react';
import Typography from 'material-ui/Typography';

import style from 'routes/Product/styles';

export default function NotFound({ error }) {
  return (
    <div className={style.empty}>
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width={511.997 / 3}
        height={511.997 / 3}
        viewBox="0 0 511.997 511.997"
        style={{ enableBackground: 'new 0 0 511.997 511.997' }}
      >
        <g>
          <path
            style={{ fill: '#FF5A5A' }}
            d="M178.61,280.677c-1.589-2.789-2.496-6.008-2.496-9.43c0-5.31,2.188-10.132,5.705-13.613
    c-3.752-8.736-5.818-18.288-5.818-28.294c0-41.667,35.816-75.446,80-75.446c31.022,0,57.92,16.652,71.193,41
    c5.628,10.325,8.806,22.036,8.806,34.446c0,10.006-2.067,19.558-5.819,28.294c3.518,3.481,5.705,8.303,5.705,13.615
    c0,3.42-0.909,6.641-2.498,9.43c-3.305,5.802-9.551,9.741-16.673,9.741h-16.968v19.863c0,4.299-3.52,7.818-7.82,7.818h-35.926
    h-37.197c-4.299,0-7.818-3.52-7.818-7.818V290.42h-15.7C188.163,290.42,181.915,286.48,178.61,280.677L178.61,280.677z M256.001,10
    C189.844,48.721,120.653,78.025,45.999,98.303v110.394c0,207.101,180.666,293.3,210.002,293.3c29.334,0,210-86.2,210-293.3V98.303
    C395.592,79.178,321.93,48.592,256.001,10z"
          />
          <path
            style={{ fill: '#FF8C5A' }}
            d="M181.819,257.634c-3.518,3.481-5.705,8.303-5.705,13.615c0,3.42,0.907,6.639,2.496,9.428
    c3.305,5.804,9.553,9.743,16.675,9.743h15.7v19.863c0,4.299,3.52,7.818,7.818,7.818H256h35.926c4.301,0,7.82-3.52,7.82-7.818
    V290.42h16.968c7.122,0,13.368-3.939,16.673-9.741c1.589-2.79,2.498-6.01,2.498-9.43c0-5.312-2.188-10.134-5.705-13.615
    c3.752-8.736,5.819-18.288,5.819-28.294c0-12.411-3.178-24.121-8.808-34.446c-13.272-24.347-40.169-41-71.191-41
    c-31.023,0-57.924,16.655-71.193,41C179.176,205.219,176,216.93,176,229.34C176.001,239.345,178.067,248.897,181.819,257.634z"
          />
        </g>
        <path d="M256.001,143.895c-30.943,0-58.289,14.905-74.494,37.547l-21.83-12.604l-2.973-11.088c-1.43-5.335-6.916-8.504-12.248-7.069
  c-5.334,1.43-8.5,6.914-7.069,12.248l1.454,5.426l-5.43,1.456c-5.334,1.43-8.5,6.914-7.07,12.248
  c1.197,4.467,5.238,7.414,9.652,7.414c0.857,0,1.729-0.111,2.596-0.343l11.086-2.972l22.203,12.818
  c-3.793,9.44-5.877,19.675-5.877,30.364c0,9.127,1.494,18.053,4.451,26.613c-2.827,4.556-4.338,9.81-4.338,15.296
  c0,1.656,0.146,3.277,0.412,4.858l-16.851,9.729l-11.085-2.971c-5.334-1.43-10.818,1.735-12.248,7.07
  c-1.43,5.335,1.735,10.818,7.07,12.249l5.428,1.455l-1.455,5.429c-1.43,5.334,1.736,10.818,7.07,12.248
  c0.867,0.232,1.738,0.343,2.596,0.343c4.414,0,8.455-2.946,9.652-7.413l2.973-11.09l16.754-9.673
  c5.09,4.322,11.67,6.938,18.854,6.938h5.7v9.863c0,9.825,7.994,17.818,17.818,17.818h73.123c9.826,0,17.82-7.993,17.82-17.818
  v-9.863h6.968c7.183,0,13.764-2.615,18.853-6.936l16.758,9.674l2.973,11.089c1.197,4.467,5.238,7.414,9.652,7.414
  c0.857,0,1.729-0.111,2.596-0.343c5.334-1.43,8.5-6.914,7.07-12.248l-1.455-5.429l5.426-1.453c5.336-1.429,8.502-6.912,7.073-12.247
  c-1.429-5.335-6.911-8.502-12.247-7.073l-11.088,2.969l-16.852-9.728c0.267-1.582,0.412-3.205,0.412-4.862
  c0-5.485-1.511-10.738-4.338-15.294c2.957-8.56,4.452-17.485,4.452-26.613c0-10.689-2.085-20.924-5.878-30.364l22.202-12.82
  l11.089,2.97c0.867,0.232,1.737,0.343,2.594,0.343c4.416,0,8.457-2.948,9.653-7.416c1.429-5.335-1.737-10.818-7.073-12.247
  l-5.427-1.454l1.454-5.427c1.43-5.334-1.736-10.818-7.071-12.247c-5.335-1.43-10.818,1.736-12.247,7.071l-2.97,11.084
  l-21.833,12.607C314.288,158.798,286.944,143.895,256.001,143.895z M316.714,280.42h-16.968c-5.523,0-10,4.477-10,10v17.681H266
  v-11.399c0-5.523-4.477-10-10-10c-5.523,0-10,4.477-10,10v11.399h-25.016V290.42c0-5.523-4.477-10-10-10h-15.7
  c-3.405,0-6.377-1.87-7.959-4.634c-0.02-0.036-0.035-0.073-0.056-0.109c-0.021-0.038-0.049-0.072-0.071-0.11
  c-0.69-1.288-1.085-2.759-1.085-4.32c0-2.447,0.972-4.755,2.736-6.501c2.924-2.891,3.779-7.277,2.157-11.055
  c-3.323-7.74-5.007-15.932-5.007-24.351c0-36.087,31.402-65.446,70-65.446s69.999,29.359,69.999,65.446
  c0,8.419-1.685,16.612-5.008,24.351c-1.622,3.778-0.767,8.164,2.157,11.055c1.765,1.746,2.736,4.055,2.736,6.503
  c0,1.556-0.392,3.021-1.078,4.306c-0.025,0.043-0.056,0.081-0.08,0.125c-0.025,0.042-0.043,0.087-0.066,0.13
  C323.075,278.56,320.11,280.42,316.714,280.42z" />
        <path d="M227.699,225.12c-8.61,0-15.634,7.023-15.634,15.633s7.023,15.631,15.634,15.631c8.612,0,15.634-7.021,15.634-15.631
  C243.333,232.143,236.311,225.12,227.699,225.12z" />
        <path d="M284.301,225.12c-8.611,0-15.632,7.023-15.632,15.633s7.021,15.633,15.632,15.633s15.633-7.023,15.633-15.633
  S292.913,225.12,284.301,225.12z" />
        <path d="M468.622,88.652C397.268,69.271,325.491,39.09,261.052,1.369c-3.12-1.826-6.983-1.826-10.103,0
  C184.657,40.169,116.76,68.72,43.377,88.652c-4.356,1.183-7.379,5.137-7.379,9.65v110.394c0,113.419,52.768,188.485,97.033,231.486
  c47.602,46.241,102.925,71.815,122.969,71.815c20.043,0,75.366-25.574,122.968-71.815c44.266-43,97.032-118.066,97.032-231.486
  V98.303C476.001,93.79,472.977,89.835,468.622,88.652z M456.001,208.697c0,106.432-49.469,176.827-90.968,217.14
  c-47.165,45.816-97.761,66.16-109.032,66.16c-11.271,0-61.869-20.344-109.033-66.16c-41.5-40.313-90.969-110.708-90.969-217.14
  V105.916c70.438-19.773,135.996-47.424,200.004-84.352c62.396,35.944,131.266,64.986,199.998,84.348L456.001,208.697
  L456.001,208.697z" />
        <path d="M348.376,400.354c1.922,1.774,4.353,2.65,6.778,2.65c2.694,0,5.381-1.083,7.353-3.219
  c17.789-19.28,32.602-40.532,44.025-63.164c2.488-4.931,0.509-10.945-4.422-13.433c-4.93-2.49-10.943-0.509-13.433,4.421
  c-10.587,20.976-24.338,40.697-40.87,58.614C344.061,390.282,344.316,396.608,348.376,400.354z" />
        <path d="M175.69,95.418c-2.125-5.099-7.979-7.508-13.076-5.387c-15.926,6.633-32.23,12.87-48.462,18.539
  c-5.214,1.821-7.965,7.524-6.144,12.738c1.439,4.123,5.307,6.706,9.439,6.706c1.094,0,2.207-0.181,3.298-0.562
  c16.6-5.797,33.272-12.175,49.558-18.958C175.401,106.371,177.813,100.517,175.69,95.418z" />
        <path d="M193.771,97.35c1.272,0,2.566-0.244,3.815-0.76c0.155-0.064,0.313-0.134,0.477-0.209c5.013-2.266,7.258-8.159,5.014-13.188
  c-2.252-5.044-8.166-7.307-13.207-5.057c-0.02,0.009-0.066,0.03-0.109,0.049c-4.976,2.174-7.318,7.94-5.235,12.982
  C186.118,95.021,189.844,97.35,193.771,97.35z" />
        <path d="M328.165,405.518l-0.078,0.071c-4.131,3.577-4.629,9.82-1.094,14.008c1.979,2.343,4.803,3.55,7.646,3.55
  c2.277,0,4.568-0.774,6.445-2.358c0.113-0.096,0.229-0.197,0.332-0.291c4.137-3.659,4.523-9.979,0.864-14.116
  C338.624,402.246,332.303,401.858,328.165,405.518z" />
        <g />
        <g />
        <g />
        <g />
        <g />
        <g />
        <g />
        <g />
        <g />
        <g />
        <g />
        <g />
        <g />
        <g />
        <g />
      </svg>

      <br />
      <br />

      <Typography type="title" align="center" gutterBottom>
        Aucun client ne trouvé.
      </Typography>
      {__DEV__ ? (
        <Typography
          type="subheading"
          align="center"
          gutterBottom
          color="secondary"
        >
          {JSON.stringify(error)}
        </Typography>
      ) : null}
    </div>
  );
}
