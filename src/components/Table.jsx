import './Table.css'
import feltTexture from '../assets/green-felt-background-texture-poker-casino-table.avif'
export default function Table(){
    return(
      <svg
        viewBox="0 0 1000 500"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        id='table'
      >
        <defs>
          <pattern
            id="felt"
            patternUnits="userSpaceOnUse"
            width="300"
            height="300"
          >
            <image
              href={feltTexture}
              width="300"
              height="300"
              preserveAspectRatio="xMidYMid slice"
            />
          </pattern>
        </defs>

        <path
          d="
              M 0 0
              H 1000
              V 290
              Q 500 470 0 290
              Z
          "
          fill="url(#felt)"
        />
      </svg>
    )
}