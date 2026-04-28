Comporte toi comme le meilleur des ai senior engineer et voici le travail que tu m'as demandé, je te prie de me faire le plus complet des prompts sans JAMAIS rien oublié une ligne de code de chaque components que je t'ai donné. J'ai pris du temps et je veux que tu les implémentes dans EVERMADE pour vscode abssoluement TOUS. On va tout donner à Claude ce que tu vas me faire en prompt avec tout les components et a voir un logiciel qui tourne et qui est prêt à faire ses premiers millions.

JE TE DEMANDE IMPÉRATIVEMENT DE PRENDRE TOUT TON TEMPS POUR TOUT ÉCRIRE ON VEUT UN VRAI DEVOIR, PREND MÊME UNE HEURE DE TON TEMPS :

Buttons:
* primary CTA : import React from 'react';

const Switch = () => {
  return (
    <label className="cursor-pointer relative h-[3em] w-[6em] rounded-full bg-[hsl(0,0%,7%)] shadow-[0px_2px_4px_0px_rgb(18,18,18,0.25),0px_4px_8px_0px_rgb(18,18,18,0.35)]">
      <span className="absolute inset-[0.1em] rounded-full border-[1px] border-[hsl(0,0%,25%)]" />
      <div className="absolute left-[0.5em] top-1/2 flex h-[2em] w-[2em] -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[inset_0px_2px_2px_0px_hsl(0,0%,85%)]">
        <div className="h-[1.5em] w-[1.5em] rounded-full bg-[hsl(0,0%,7%)] shadow-[0px_2px_2px_0px_hsl(0,0%,85%)]" />
      </div>
      <div className="absolute right-[0.5em] top-1/2 h-[0.25em] w-[1.5em] -translate-y-1/2 rounded-full bg-[hsl(0,0%,50%)] shadow-[inset_0px_2px_1px_0px_hsl(0,0%,40%)]" />
      <input className="peer h-[1em] w-[1em] opacity-0" id name type="checkbox" />
      <span className="absolute left-[0.25em] top-1/2 flex h-[2.5em] w-[2.5em] -translate-y-1/2 items-center justify-center rounded-full bg-[rgb(26,26,26)] shadow-[inset_4px_4px_4px_0px_rgba(64,64,64,0.25),inset_-4px_-4px_4px_0px_rgba(16,16,16,0.5)] duration-300 peer-checked:left-[calc(100%-2.75em)]">
        <span className="relative h-full w-full rounded-full">
          <span className="absolute inset-[0.1em] rounded-full border-[1px] border-[hsl(0,0%,50%)]" />
        </span>
      </span>
    </label>
  );
}

export default Switch;

and: <!-- From Uiverse.io by shivam_7937 --> 
<div class="relative inline-flex items-center justify-center gap-4 group">
  <div
    class="absolute inset-0 duration-1000 opacity-60 transitiona-all bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200"
  ></div>
  <a
    role="button"
    class="group relative inline-flex items-center justify-center text-base rounded-xl bg-gray-900 px-8 py-3 font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30"
    title="payment"
    href="#"
    >Get Started For Free<svg
      aria-hidden="true"
      viewBox="0 0 10 10"
      height="10"
      width="10"
      fill="none"
      class="mt-0.5 ml-2 -mr-1 stroke-white stroke-2"
    >
      <path
        d="M0 5h7"
        class="transition opacity-0 group-hover:opacity-100"
      ></path>
      <path
        d="M1 1l4 4-4 4"
        class="transition group-hover:translate-x-[3px]"
      ></path>
    </svg>
  </a>
</div>

Secondary CTA: import React from 'react';

const Button = () => {
  return (
    <button className="inline-block cursor-pointer items-center justify-center rounded-xl border-[1.58px] border-zinc-600 bg-zinc-950 px-5 py-3 font-medium text-slate-200 shadow-md transition-all duration-300 hover:[transform:translateY(-.335rem)] hover:shadow-xl">
      Hello
      <span className="text-slate-300/85"> ─ simple button</span>
    </button>
  );
}

export default Button;

and le deuxième: 

 import React from 'react';

const Button = () => {
  return (
    <button className="items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-transform duration-200 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group relative animate-rainbow cursor-pointer border-0 bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] bg-[length:200%] text-foreground [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent] before:absolute before:bottom-[-20%] before:left-1/2 before:z-[0] before:h-[20%] before:w-[60%] before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] before:[filter:blur(calc(0.8*1rem))] dark:bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] hover:scale-105 active:scale-95 h-10 px-4 py-2 inline-flex">
      <div className="flex items-center">
        <svg className="size-4" viewBox="0 0 438.549 438.549">
          <path d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z" fill="#fff" /></svg><span className="ml-1 text-white lg:inline p-1">Star on GitHub</span>
      </div>
      <div className="ml-2 flex items-center gap-1 text-sm md:flex">
        <svg className="size-4 text-gray-500 transition-all duration-200 group-hover:text-yellow-300" data-slot="icon" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path clipRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" fillRule="evenodd" />
        </svg>
        <span className="inline-block tabular-nums tracking-wider font-display font-medium text-black dark:text-white">11</span>
      </div>
    </button>
  );
}

export default Button; 

- loading button: import React from 'react';

const Loader = () => {
  return (
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-500 mx-auto" />
      <h2 className="text-zinc-900 dark:text-white mt-4">Loading...</h2>
      <p className="text-zinc-600 dark:text-zinc-400">
        Your adventure is about to begin
      </p>
    </div>
  );
}

export default Loader;

and le deuxième : import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="spinner">
        <div className="spinnerin" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .spinner {
    width: 3em;
    height: 3em;
    cursor: not-allowed;
    border-radius: 50%;
    border: 2px solid #444;
    box-shadow: -10px -10px 10px #6359f8, 0px -10px 10px 0px #9c32e2, 10px -10px 10px #f36896, 10px 0 10px #ff0b0b, 10px 10px 10px 0px#ff5500, 0 10px 10px 0px #ff9500, -10px 10px 10px 0px #ffb700;
    animation: rot55 0.7s linear infinite;
  }

  .spinnerin {
    border: 2px solid #444;
    width: 1.5em;
    height: 1.5em;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  @keyframes rot55 {
    to {
      transform: rotate(360deg);
    }
  }`;

export default Loader;

- Pill buttons: 

import React from 'react';
import styled from 'styled-components';

const Button = () => {
  return (
    <StyledWrapper>
      <button className="btn">
        <svg height={24} width={24} fill="#FFFFFF" viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" className="sparkle">
          <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z" />
        </svg>
        <span className="text">Generate</span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .btn {
    border: none;
    width: 15em;
    height: 5em;
    border-radius: 3em;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    background: #1C1A1C;
    cursor: pointer;
    transition: all 450ms ease-in-out;
  }

  .sparkle {
    fill: #AAAAAA;
    transition: all 800ms ease;
  }

  .text {
    font-weight: 600;
    color: #AAAAAA;
    font-size: medium;
  }

  .btn:hover {
    background: linear-gradient(0deg,#A47CF3,#683FEA);
    box-shadow: inset 0px 1px 0px 0px rgba(255, 255, 255, 0.4),
    inset 0px -4px 0px 0px rgba(0, 0, 0, 0.2),
    0px 0px 0px 4px rgba(255, 255, 255, 0.2),
    0px 0px 180px 0px #9917FF;
    transform: translateY(-2px);
  }

  .btn:hover .text {
    color: white;
  }

  .btn:hover .sparkle {
    fill: white;
    transform: scale(1.2);
  }`;

export default Button;

et le deuxième: import React from 'react';
import styled from 'styled-components';

const Button = () => {
  return (
    <StyledWrapper>
      <button className="boton-elegante">Explore</button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .boton-elegante {
    padding: 15px 30px;
    border: 2px solid #2c2c2c;
    background-color: #1a1a1a;
    color: #ffffff;
    font-size: 1.2rem;
    cursor: pointer;
    border-radius: 30px;
    transition: all 0.4s ease;
    outline: none;
    position: relative;
    overflow: hidden;
    font-weight: bold;
  }

  .boton-elegante::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.25) 0%,
      rgba(255, 255, 255, 0) 70%
    );
    transform: scale(0);
    transition: transform 0.5s ease;
  }

  .boton-elegante:hover::after {
    transform: scale(4);
  }

  .boton-elegante:hover {
    border-color: #666666;
    background: #292929;
  }`;

export default Button;

- Gradient buttons : import React from 'react';
import styled from 'styled-components';

const Button = () => {
  return (
    <StyledWrapper>
      <div className="btn-wrapper">
        <button className="btn">
          <svg className="btn-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
          </svg>
          <div className="txt-wrapper">
            <div className="txt-1">
              <span className="btn-letter">G</span>
              <span className="btn-letter">e</span>
              <span className="btn-letter">n</span>
              <span className="btn-letter">e</span>
              <span className="btn-letter">r</span>
              <span className="btn-letter">a</span>
              <span className="btn-letter">t</span>
              <span className="btn-letter">e</span>
            </div>
            <div className="txt-2">
              <span className="btn-letter">G</span>
              <span className="btn-letter">e</span>
              <span className="btn-letter">n</span>
              <span className="btn-letter">e</span>
              <span className="btn-letter">r</span>
              <span className="btn-letter">a</span>
              <span className="btn-letter">t</span>
              <span className="btn-letter">i</span>
              <span className="btn-letter">n</span>
              <span className="btn-letter">g</span>
            </div>
          </div>
        </button>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .btn-wrapper {
    position: relative;
    display: inline-block;
  }

  .btn {
    --border-radius: 24px;
    --padding: 4px;
    --transition: 0.4s;
    --button-color: #101010; /* Same as background */
    --highlight-color-hue: 210deg;

    user-select: none;
    display: flex;
    justify-content: center;
    padding: 0.5em 0.5em 0.5em 1.1em;
    font-family: "Poppins", "Inter", "Segoe UI", sans-serif;
    font-size: 1em;
    font-weight: 400; 
    background-color: var(--button-color);

    box-shadow:
      /* inset */
      inset 0px 1px 1px rgba(255, 255, 255, 0.2),
      inset 0px 2px 2px rgba(255, 255, 255, 0.15),
      inset 0px 4px 4px rgba(255, 255, 255, 0.1),
      inset 0px 8px 8px rgba(255, 255, 255, 0.05),
      inset 0px 16px 16px rgba(255, 255, 255, 0.05),
      /* drop */ 0px -1px 1px rgba(0, 0, 0, 0.02),
      0px -2px 2px rgba(0, 0, 0, 0.03),
      0px -4px 4px rgba(0, 0, 0, 0.05),
      0px -8px 8px rgba(0, 0, 0, 0.06),
      0px -16px 16px rgba(0, 0, 0, 0.08);

    border: solid 1px #fff2;
    border-radius: var(--border-radius);
    cursor: pointer;

    transition:
      box-shadow var(--transition),
      border var(--transition),
      background-color var(--transition);
  }
  .btn::before {
    content: "";
    position: absolute;
    top: calc(0px - var(--padding));
    left: calc(0px - var(--padding));
    width: calc(100% + var(--padding) * 2);
    height: calc(100% + var(--padding) * 2);
    border-radius: calc(var(--border-radius) + var(--padding));
    pointer-events: none;
    background-image: linear-gradient(0deg, #0004, #000a);

    z-index: -1;
    transition:
      box-shadow var(--transition),
      filter var(--transition);
    box-shadow:
      0 -8px 8px -6px #0000 inset,
      0 -16px 16px -8px #00000000 inset,
      1px 1px 1px #fff2,
      2px 2px 2px #fff1,
      -1px -1px 1px #0002,
      -2px -2px 2px #0001;
  }
  .btn::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    pointer-events: none;
    background-image: linear-gradient(
      0deg,
      #fff,
      hsl(var(--highlight-color-hue), 100%, 70%),
      hsla(var(--highlight-color-hue), 100%, 70%, 50%),
      8%,
      transparent
    );
    background-position: 0 0;
    opacity: 0;
    transition:
      opacity var(--transition),
      filter var(--transition);
  }

  .btn-letter {
    position: relative;
    display: inline-block;
    color: #fff5;
    animation: letter-anim 2s ease-in-out infinite;
    transition:
      color var(--transition),
      text-shadow var(--transition),
      opacity var(--transition);
  }

  @keyframes letter-anim {
    50% {
      text-shadow: 0 0 3px #fff8;
      color: #fff;
    }
  }

  .btn-svg {
    flex-grow: 1;
    height: 24px;
    margin-right: 0.5rem;
    fill: #e8e8e8;
    animation: flicker 2s linear infinite;
    animation-delay: 0.5s;
    filter: drop-shadow(0 0 2px #fff9);
    transition:
      fill var(--transition),
      filter var(--transition),
      opacity var(--transition);
  }
  @keyframes flicker {
    50% {
      opacity: 0.3;
    }
  }

  /* Focus state */
  .txt-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    min-width: 6.4em;
  }
  .txt-1,
  .txt-2 {
    position: absolute;
    word-spacing: -1em;
  }
  .txt-1 {
    animation: appear-anim 1s ease-in-out forwards;
  }
  .txt-2 {
    opacity: 0;
  }
  @keyframes appear-anim {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .btn:focus .txt-1 {
    animation: opacity-anim 0.3s ease-in-out forwards;
    animation-delay: 1s;
  }
  .btn:focus .txt-2 {
    animation: opacity-anim 0.3s ease-in-out reverse forwards;
    animation-delay: 1s;
  }
  @keyframes opacity-anim {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  .btn:focus .btn-letter {
    animation:
      focused-letter-anim 1s ease-in-out forwards,
      letter-anim 1.2s ease-in-out infinite;
    animation-delay: 0s, 1s;
  }
  @keyframes focused-letter-anim {
    0%,
    100% {
      filter: blur(0px);
    }
    50% {
      transform: scale(2);
      filter: blur(10px) brightness(150%)
        drop-shadow(-36px 12px 12px hsl(var(--highlight-color-hue), 100%, 70%));
    }
  }
  .btn:focus .btn-svg {
    animation-duration: 1.2s;
    animation-delay: 0.2s;
  }

  .btn:focus::before {
    box-shadow:
      0 -8px 12px -6px #fff3 inset,
      0 -16px 16px -8px hsla(var(--highlight-color-hue), 100%, 70%, 20%) inset,
      1px 1px 1px #fff3,
      2px 2px 2px #fff1,
      -1px -1px 1px #0002,
      -2px -2px 2px #0001;
  }
  .btn:focus::after {
    opacity: 0.6;
    mask-image: linear-gradient(0deg, #fff, transparent);
    filter: brightness(100%);
  }

  /* Animation delays for .btn-letter elements */
  .btn-letter:nth-child(1),
  .btn:focus .btn-letter:nth-child(1) {
    animation-delay: 0s;
  }
  .btn-letter:nth-child(2),
  .btn:focus .btn-letter:nth-child(2) {
    animation-delay: 0.08s;
  }
  .btn-letter:nth-child(3),
  .btn:focus .btn-letter:nth-child(3) {
    animation-delay: 0.16s;
  }
  .btn-letter:nth-child(4),
  .btn:focus .btn-letter:nth-child(4) {
    animation-delay: 0.24s;
  }
  .btn-letter:nth-child(5),
  .btn:focus .btn-letter:nth-child(5) {
    animation-delay: 0.32s;
  }
  .btn-letter:nth-child(6),
  .btn:focus .btn-letter:nth-child(6) {
    animation-delay: 0.4s;
  }
  .btn-letter:nth-child(7),
  .btn:focus .btn-letter:nth-child(7) {
    animation-delay: 0.48s;
  }
  .btn-letter:nth-child(8),
  .btn:focus .btn-letter:nth-child(8) {
    animation-delay: 0.56s;
  }
  .btn-letter:nth-child(9),
  .btn:focus .btn-letter:nth-child(9) {
    animation-delay: 0.64s;
  }
  .btn-letter:nth-child(10),
  .btn:focus .btn-letter:nth-child(10) {
    animation-delay: 0.72s;
  }
  .btn-letter:nth-child(11),
  .btn:focus .btn-letter:nth-child(11) {
    animation-delay: 0.8s;
  }
  .btn-letter:nth-child(12),
  .btn:focus .btn-letter:nth-child(12) {
    animation-delay: 0.88s;
  }
  .btn-letter:nth-child(13),
  .btn:focus .btn-letter:nth-child(13) {
    animation-delay: 0.96s;
  }

  /* Active state */
  .btn:active {
    border: solid 1px hsla(var(--highlight-color-hue), 100%, 80%, 70%);
    background-color: hsla(var(--highlight-color-hue), 50%, 20%, 0.5);
  }
  .btn:active::before {
    box-shadow:
      0 -8px 12px -6px #fffa inset,
      0 -16px 16px -8px hsla(var(--highlight-color-hue), 100%, 70%, 80%) inset,
      1px 1px 1px #fff4,
      2px 2px 2px #fff2,
      -1px -1px 1px #0002,
      -2px -2px 2px #0001;
  }
  .btn:active::after {
    opacity: 1;
    mask-image: linear-gradient(0deg, #fff, transparent);
    filter: brightness(200%);
  }
  .btn:active .btn-letter {
    text-shadow: 0 0 1px hsla(var(--highlight-color-hue), 100%, 90%, 90%);
    animation: none;
  }

  /* Hover state */
  .btn:hover {
    border: solid 1px hsla(var(--highlight-color-hue), 100%, 80%, 40%);
  }

  .btn:hover::before {
    box-shadow:
      0 -8px 8px -6px #fffa inset,
      0 -16px 16px -8px hsla(var(--highlight-color-hue), 100%, 70%, 30%) inset,
      1px 1px 1px #fff2,
      2px 2px 2px #fff1,
      -1px -1px 1px #0002,
      -2px -2px 2px #0001;
  }

  .btn:hover::after {
    opacity: 1;
    mask-image: linear-gradient(0deg, #fff, transparent);
  }

  .btn:hover .btn-svg {
    fill: #fff;
    filter: drop-shadow(0 0 3px hsl(var(--highlight-color-hue), 100%, 70%))
      drop-shadow(0 -4px 6px #0009);
    animation: none;
  }`;

export default Button;

- and this type of button: 

import React from 'react';
import styled from 'styled-components';

const Button = () => {
  return (
    <StyledWrapper>
      <button className="button">Start</button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .button {
    /* in scss with just one variable i can change opacity with rgba(variable, opacity) but in css it's not possible so i have used three seperate variables */
    /* with hue-rotate color can be changed */
    --main-color: rgb(46, 213, 115);
    --main-bg-color: rgba(46, 213, 116, 0.36);
    --pattern-color: rgba(46, 213, 116, 0.073);

    /* change this rotation value */
    filter: hue-rotate(0deg);

    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.5rem;
    background: radial-gradient(
        circle,
        var(--main-bg-color) 0%,
        rgba(0, 0, 0, 0) 95%
      ),
      linear-gradient(var(--pattern-color) 1px, transparent 1px),
      linear-gradient(to right, var(--pattern-color) 1px, transparent 1px);
    background-size:
      cover,
      15px 15px,
      15px 15px;
    background-position:
      center center,
      center center,
      center center;
    border-image: radial-gradient(
        circle,
        var(--main-color) 0%,
        rgba(0, 0, 0, 0) 100%
      )
      1;
    border-width: 1px 0 1px 0;
    color: var(--main-color);
    padding: 1rem 3rem;
    font-weight: 700;
    font-size: 1.5rem;
    transition: background-size 0.2s ease-in-out;
  }

  .button:hover {
    background-size:
      cover,
      10px 10px,
      10px 10px;
  }
  .button:active {
    filter: hue-rotate(250deg);
  }`;

export default Button; 

- Text input: import React from 'react';
import styled from 'styled-components';

const Input = () => {
  return (
    <StyledWrapper>
      <div className="messageBox">
        <div className="fileUploadWrapper">
          <label htmlFor="file">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 337 337">
              <circle strokeWidth={20} stroke="#6c6c6c" fill="none" r="158.5" cy="168.5" cx="168.5" />
              <path strokeLinecap="round" strokeWidth={25} stroke="#6c6c6c" d="M167.759 79V259" />
              <path strokeLinecap="round" strokeWidth={25} stroke="#6c6c6c" d="M79 167.138H259" />
            </svg>
            <span className="tooltip">Add an image</span>
          </label>
          <input type="file" id="file" name="file" />
        </div>
        <input required placeholder="Message..." type="text" id="messageInput" />
        <button id="sendButton">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 664 663">
            <path fill="none" d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888" />
            <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="33.67" stroke="#6c6c6c" d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888" />
          </svg>
        </button>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .messageBox {
    width: fit-content;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #2d2d2d;
    padding: 0 15px;
    border-radius: 10px;
    border: 1px solid rgb(63, 63, 63);
  }
  .messageBox:focus-within {
    border: 1px solid rgb(110, 110, 110);
  }
  .fileUploadWrapper {
    width: fit-content;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Arial, Helvetica, sans-serif;
  }

  #file {
    display: none;
  }
  .fileUploadWrapper label {
    cursor: pointer;
    width: fit-content;
    height: fit-content;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .fileUploadWrapper label svg {
    height: 18px;
  }
  .fileUploadWrapper label svg path {
    transition: all 0.3s;
  }
  .fileUploadWrapper label svg circle {
    transition: all 0.3s;
  }
  .fileUploadWrapper label:hover svg path {
    stroke: #fff;
  }
  .fileUploadWrapper label:hover svg circle {
    stroke: #fff;
    fill: #3c3c3c;
  }
  .fileUploadWrapper label:hover .tooltip {
    display: block;
    opacity: 1;
  }
  .tooltip {
    position: absolute;
    top: -40px;
    display: none;
    opacity: 0;
    color: white;
    font-size: 10px;
    text-wrap: nowrap;
    background-color: #000;
    padding: 6px 10px;
    border: 1px solid #3c3c3c;
    border-radius: 5px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.596);
    transition: all 0.3s;
  }
  #messageInput {
    width: 200px;
    height: 100%;
    background-color: transparent;
    outline: none;
    border: none;
    padding-left: 10px;
    color: white;
  }
  #messageInput:focus ~ #sendButton svg path,
  #messageInput:valid ~ #sendButton svg path {
    fill: #3c3c3c;
    stroke: white;
  }

  #sendButton {
    width: fit-content;
    height: 100%;
    background-color: transparent;
    outline: none;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
  }
  #sendButton svg {
    height: 18px;
    transition: all 0.3s;
  }
  #sendButton svg path {
    transition: all 0.3s;
  }
  #sendButton:hover svg path {
    fill: #3c3c3c;
    stroke: white;
  }`;

export default Input;

et la deuxième : import React from 'react';
import styled from 'styled-components';

const Input = () => {
  return (
    <StyledWrapper>
      <input placeholder="Username" className="input" name="text" type="text" />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .input {
    margin: 30px;
    background: none;
    border: none;
    outline: none;
    max-width: 190px;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 9999px;
    box-shadow: inset 2px 5px 10px rgb(5, 5, 5);
    color: #fff;
  }`;

export default Input;

and : import React from 'react';
import styled from 'styled-components';

const Input = () => {
  return (
    <StyledWrapper>
      <div>
        <div className="grid" />
        <div id="poda">
          <div className="glow" />
          <div className="darkBorderBg" />
          <div className="darkBorderBg" />
          <div className="darkBorderBg" />
          <div className="white" />
          <div className="border" />
          <div id="main">
            <input placeholder="Search..." type="text" name="text" className="input" />
            <div id="input-mask" />
            <div id="pink-mask" />
            <div className="filterBorder" />
            <div id="filter-icon">
              <svg preserveAspectRatio="none" height={27} width={27} viewBox="4.8 4.56 14.832 15.408" fill="none">
                <path d="M8.16 6.65002H15.83C16.47 6.65002 16.99 7.17002 16.99 7.81002V9.09002C16.99 9.56002 16.7 10.14 16.41 10.43L13.91 12.64C13.56 12.93 13.33 13.51 13.33 13.98V16.48C13.33 16.83 13.1 17.29 12.81 17.47L12 17.98C11.24 18.45 10.2 17.92 10.2 16.99V13.91C10.2 13.5 9.97 12.98 9.73 12.69L7.52 10.36C7.23 10.08 7 9.55002 7 9.20002V7.87002C7 7.17002 7.52 6.65002 8.16 6.65002Z" stroke="#d6d6e6" strokeWidth={1} strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div id="search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width={24} viewBox="0 0 24 24" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" height={24} fill="none" className="feather feather-search">
                <circle stroke="url(#search)" r={8} cy={11} cx={11} />
                <line stroke="url(#searchl)" y2="16.65" y1={22} x2="16.65" x1={22} />
                <defs>
                  <linearGradient gradientTransform="rotate(50)" id="search">
                    <stop stopColor="#f8e7f8" offset="0%" />
                    <stop stopColor="#b6a9b7" offset="50%" />
                  </linearGradient>
                  <linearGradient id="searchl">
                    <stop stopColor="#b6a9b7" offset="0%" />
                    <stop stopColor="#837484" offset="50%" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .grid {
    height: 800px;
    width: 800px;
    background-image: linear-gradient(to right, #0f0f10 1px, transparent 1px),
      linear-gradient(to bottom, #0f0f10 1px, transparent 1px);
    background-size: 1rem 1rem;
    background-position: center center;
    position: absolute;
    z-index: -1;
    filter: blur(1px);
  }
  .white,
  .border,
  .darkBorderBg,
  .glow {
    max-height: 70px;
    max-width: 314px;
    height: 100%;
    width: 100%;
    position: absolute;
    overflow: hidden;
    z-index: -1;
    /* Border Radius */
    border-radius: 12px;
    filter: blur(3px);
  }
  .input {
    background-color: #010201;
    border: none;
    /* padding:7px; */
    width: 301px;
    height: 56px;
    border-radius: 10px;
    color: white;
    padding-inline: 59px;
    font-size: 18px;
  }
  #poda {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .input::placeholder {
    color: #c0b9c0;
  }

  .input:focus {
    outline: none;
  }

  #main:focus-within > #input-mask {
    display: none;
  }

  #input-mask {
    pointer-events: none;
    width: 100px;
    height: 20px;
    position: absolute;
    background: linear-gradient(90deg, transparent, black);
    top: 18px;
    left: 70px;
  }
  #pink-mask {
    pointer-events: none;
    width: 30px;
    height: 20px;
    position: absolute;
    background: #cf30aa;
    top: 10px;
    left: 5px;
    filter: blur(20px);
    opacity: 0.8;
    //animation:leftright 4s ease-in infinite;
    transition: all 2s;
  }
  #main:hover > #pink-mask {
    //animation: rotate 4s linear infinite;
    opacity: 0;
  }

  .white {
    max-height: 63px;
    max-width: 307px;
    border-radius: 10px;
    filter: blur(2px);
  }

  .white::before {
    content: "";
    z-index: -2;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(83deg);
    position: absolute;
    width: 600px;
    height: 600px;
    background-repeat: no-repeat;
    background-position: 0 0;
    filter: brightness(1.4);
    background-image: conic-gradient(
      rgba(0, 0, 0, 0) 0%,
      #a099d8,
      rgba(0, 0, 0, 0) 8%,
      rgba(0, 0, 0, 0) 50%,
      #dfa2da,
      rgba(0, 0, 0, 0) 58%
    );
    //  animation: rotate 4s linear infinite;
    transition: all 2s;
  }
  .border {
    max-height: 59px;
    max-width: 303px;
    border-radius: 11px;
    filter: blur(0.5px);
  }
  .border::before {
    content: "";
    z-index: -2;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(70deg);
    position: absolute;
    width: 600px;
    height: 600px;
    filter: brightness(1.3);
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(
      #1c191c,
      #402fb5 5%,
      #1c191c 14%,
      #1c191c 50%,
      #cf30aa 60%,
      #1c191c 64%
    );
    // animation: rotate 4s 0.1s linear infinite;
    transition: all 2s;
  }
  .darkBorderBg {
    max-height: 65px;
    max-width: 312px;
  }
  .darkBorderBg::before {
    content: "";
    z-index: -2;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(82deg);
    position: absolute;
    width: 600px;
    height: 600px;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(
      rgba(0, 0, 0, 0),
      #18116a,
      rgba(0, 0, 0, 0) 10%,
      rgba(0, 0, 0, 0) 50%,
      #6e1b60,
      rgba(0, 0, 0, 0) 60%
    );
    transition: all 2s;
  }
  #poda:hover > .darkBorderBg::before {
    transform: translate(-50%, -50%) rotate(262deg);
  }
  #poda:hover > .glow::before {
    transform: translate(-50%, -50%) rotate(240deg);
  }
  #poda:hover > .white::before {
    transform: translate(-50%, -50%) rotate(263deg);
  }
  #poda:hover > .border::before {
    transform: translate(-50%, -50%) rotate(250deg);
  }

  #poda:hover > .darkBorderBg::before {
    transform: translate(-50%, -50%) rotate(-98deg);
  }
  #poda:hover > .glow::before {
    transform: translate(-50%, -50%) rotate(-120deg);
  }
  #poda:hover > .white::before {
    transform: translate(-50%, -50%) rotate(-97deg);
  }
  #poda:hover > .border::before {
    transform: translate(-50%, -50%) rotate(-110deg);
  }

  #poda:focus-within > .darkBorderBg::before {
    transform: translate(-50%, -50%) rotate(442deg);
    transition: all 4s;
  }
  #poda:focus-within > .glow::before {
    transform: translate(-50%, -50%) rotate(420deg);
    transition: all 4s;
  }
  #poda:focus-within > .white::before {
    transform: translate(-50%, -50%) rotate(443deg);
    transition: all 4s;
  }
  #poda:focus-within > .border::before {
    transform: translate(-50%, -50%) rotate(430deg);
    transition: all 4s;
  }

  .glow {
    overflow: hidden;
    filter: blur(30px);
    opacity: 0.4;
    max-height: 130px;
    max-width: 354px;
  }
  .glow:before {
    content: "";
    z-index: -2;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(60deg);
    position: absolute;
    width: 999px;
    height: 999px;
    background-repeat: no-repeat;
    background-position: 0 0;
    /*border color, change middle color*/
    background-image: conic-gradient(
      #000,
      #402fb5 5%,
      #000 38%,
      #000 50%,
      #cf30aa 60%,
      #000 87%
    );
    /* change speed here */
    //animation: rotate 4s 0.3s linear infinite;
    transition: all 2s;
  }

  @keyframes rotate {
    100% {
      transform: translate(-50%, -50%) rotate(450deg);
    }
  }
  @keyframes leftright {
    0% {
      transform: translate(0px, 0px);
      opacity: 1;
    }

    49% {
      transform: translate(250px, 0px);
      opacity: 0;
    }
    80% {
      transform: translate(-40px, 0px);
      opacity: 0;
    }

    100% {
      transform: translate(0px, 0px);
      opacity: 1;
    }
  }

  #filter-icon {
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    max-height: 40px;
    max-width: 38px;
    height: 100%;
    width: 100%;

    isolation: isolate;
    overflow: hidden;
    /* Border Radius */
    border-radius: 10px;
    background: linear-gradient(180deg, #161329, black, #1d1b4b);
    border: 1px solid transparent;
  }
  .filterBorder {
    height: 42px;
    width: 40px;
    position: absolute;
    overflow: hidden;
    top: 7px;
    right: 7px;
    border-radius: 10px;
  }

  .filterBorder::before {
    content: "";

    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(90deg);
    position: absolute;
    width: 600px;
    height: 600px;
    background-repeat: no-repeat;
    background-position: 0 0;
    filter: brightness(1.35);
    background-image: conic-gradient(
      rgba(0, 0, 0, 0),
      #3d3a4f,
      rgba(0, 0, 0, 0) 50%,
      rgba(0, 0, 0, 0) 50%,
      #3d3a4f,
      rgba(0, 0, 0, 0) 100%
    );
    animation: rotate 4s linear infinite;
  }
  #main {
    position: relative;
  }
  #search-icon {
    position: absolute;
    left: 20px;
    top: 15px;
  }`;

export default Input;

- Slide buttons : 
import React from 'react';
import styled from 'styled-components';

const Switch = () => {
  return (
    <StyledWrapper>
      <div className="toggle-border">
        <input id="one" type="checkbox" />
        <label htmlFor="one">
          <div className="handle" />
        </label>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .toggle-border {
   border: 2px solid #f0ebeb;
   border-radius: 130px;
   margin-bottom: 45px;
   padding: 1px 2px;
   background: linear-gradient(to bottom right, white, rgba(220,220,220,.5)), white;
   box-shadow: 0 0 0 2px #fbfbfb;
   cursor: pointer;
   display: flex;
   align-items: center;
  }

  .toggle-border:last-child {
   margin-bottom: 0;
  }

  .toggle-border input[type="checkbox"] {
   display: none;
  }

  .toggle-border label {
   position: relative;
   display: inline-block;
   width: 65px;
   height: 20px;
   background: #d13613;
   border-radius: 80px;
   cursor: pointer;
   box-shadow: inset 0 0 16px rgba(0,0,0,.3);
   transition: background .5s;
  }

  .toggle-border input[type="checkbox"]:checked + label {
   background: #13d162;
  }

  .handle {
   position: absolute;
   top: -8px;
   left: -10px;
   width: 35px;
   height: 35px;
   border: 1px solid #e5e5e5;
   background: repeating-radial-gradient(circle at 50% 50%, rgba(200,200,200,.2) 0%, rgba(200,200,200,.2) 2%, transparent 2%, transparent 3%, rgba(200,200,200,.2) 3%, transparent 3%), conic-gradient(white 0%, silver 10%, white 35%, silver 45%, white 60%, silver 70%, white 80%, silver 95%, white 100%);
   border-radius: 50%;
   box-shadow: 3px 5px 10px 0 rgba(0,0,0,.4);
   transition: left .4s;
  }

  .toggle-border input[type="checkbox"]:checked + label > .handle {
   left: calc(100% - 35px + 10px);
  }`;

export default Switch;

and : import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <label className="toggle-container">
        <input type="checkbox" />
        <div className="toggle-button">
          <div className="glow" />
          <div className="texture" />
        </div>
      </label>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .toggle-container {
    perspective: 1800px;
    position: relative;
  }

  .toggle-container input {
    display: none; /* Hide default checkbox */
  }

  .toggle-button {
    position: relative;
    width: 150px;
    height: 70px;
    background: linear-gradient(
      145deg,
      #4a4a3a,
      #5a5a4a
    ); /* Brushed metal base */
    border-radius: 35px;
    box-shadow: 
                  /* Neumorphic outer shadows */
      10px 10px 20px rgba(0, 0, 0, 0.5),
      -10px -10px 20px rgba(255, 140, 0, 0.1),
      /* Subtle orange tint */ /* Skeuomorphic inset for metallic texture */ inset
        0 3px 6px rgba(255, 255, 255, 0.1),
      inset 0 -3px 6px rgba(0, 0, 0, 0.6);
    cursor: pointer;
    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Elastic snap */
    transform-style: preserve-3d;
    transform: translateZ(0);
  }

  /* Engraved track with micro-texture */
  .toggle-button::after {
    content: "";
    position: absolute;
    width: 138px;
    height: 58px;
    background: linear-gradient(
      145deg,
      rgba(255, 69, 0, 0.2),
      rgba(0, 0, 0, 0.5)
    );
    border-radius: 29px;
    top: 6px;
    left: 6px;
    box-shadow:
      inset 0 0 12px rgba(0, 0, 0, 0.7),
      inset 0 0 4px rgba(255, 140, 0, 0.3),
      /* Orange-red accent */ /* Micro-texture for realism */ inset 0 0 2px
        rgba(255, 255, 255, 0.05);
    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    pointer-events: none;
  }

  /* Textured, gem-like knob */
  .toggle-button::before {
    content: "";
    position: absolute;
    width: 64px;
    height: 64px;
    background: radial-gradient(
      circle at 30% 20%,
      #ff4500,
      #ff8c00
    ); /* Orange-red gradient */
    border-radius: 50%;
    top: 3px;
    left: 3px;
    box-shadow: 
                  /* Neumorphic depth */
      5px 5px 10px rgba(0, 0, 0, 0.6),
      -5px -5px 10px rgba(255, 255, 255, 0.15),
      /* Skeuomorphic texture */ inset 0 -2px 5px rgba(0, 0, 0, 0.7),
      inset 0 2px 5px rgba(255, 255, 255, 0.3),
      /* Subtle polished highlight */ 2px 2px 3px rgba(255, 255, 255, 0.2);
    transition: all 0.5s cubic-bezier(0.77, -0.4, 0.3, 1.4); /* Resonant bounce */
    transform: translateZ(25px) scale(1);
    z-index: 2;
  }

  /* Subtle texture overlay for knob */
  .toggle-button .texture {
    position: absolute;
    width: 64px;
    height: 64px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1), transparent);
    border-radius: 50%;
    top: 3px;
    left: 3px;
    opacity: 0.3;
    transition: all 0.5s cubic-bezier(0.77, -0.4, 0.3, 1.4);
    transform: translateZ(26px);
    pointer-events: none;
  }

  /* Minimal glow for realism */
  .toggle-button .glow {
    position: absolute;
    width: 70px;
    height: 70px;
    background: radial-gradient(
      circle,
      rgba(255, 140, 0, 0.3),
      transparent
    ); /* Subtle orange-red glow */
    border-radius: 50%;
    top: 0;
    left: 0;
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateZ(20px);
    pointer-events: none;
  }

  /* Checked state */
  .toggle-container input:checked ~ .toggle-button {
    background: linear-gradient(
      145deg,
      #3a4a3a,
      #4a5a4a
    ); /* Yellow-green metallic */
    box-shadow:
      10px 10px 20px rgba(0, 0, 0, 0.5),
      -10px -10px 20px rgba(154, 205, 50, 0.1),
      /* Subtle yellow-green tint */ inset 0 3px 6px rgba(255, 255, 255, 0.1),
      inset 0 -3px 6px rgba(0, 0, 0, 0.6);
  }

  .toggle-container input:checked ~ .toggle-button::before {
    left: 82px;
    background: radial-gradient(
      circle at 30% 20%,
      #9acd32,
      #32cd32
    ); /* Yellow-green gradient */
    transform: translateZ(25px) rotate(360deg) scale(1.08); /* Spin and pulse */
    box-shadow:
      5px 5px 10px rgba(0, 0, 0, 0.6),
      -5px -5px 10px rgba(255, 255, 255, 0.15),
      inset 0 -2px 5px rgba(0, 0, 0, 0.7),
      inset 0 2px 5px rgba(255, 255, 255, 0.3),
      2px 2px 3px rgba(255, 255, 255, 0.2);
  }

  .toggle-container input:checked ~ .toggle-button::after {
    background: linear-gradient(
      145deg,
      rgba(154, 205, 50, 0.2),
      rgba(0, 0, 0, 0.5)
    );
    box-shadow:
      inset 0 0 12px rgba(0, 0, 0, 0.7),
      inset 0 0 4px rgba(154, 205, 50, 0.3),
      /* Yellow-green accent */ inset 0 0 2px rgba(255, 255, 255, 0.05);
  }

  .toggle-container input:checked ~ .toggle-button .glow {
    background: radial-gradient(
      circle,
      rgba(154, 205, 50, 0.3),
      transparent
    ); /* Subtle yellow-green glow */
    left: 76px;
    opacity: 0.5;
  }

  .toggle-container input:checked ~ .toggle-button .texture {
    left: 82px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.15), transparent);
  }

  /* Hover effect */
  .toggle-button:hover {
    box-shadow:
      12px 12px 24px rgba(0, 0, 0, 0.6),
      -12px -12px 24px rgba(255, 140, 0, 0.15);
    transform: translateZ(5px);
  }

  .toggle-button:hover::before {
    transform: translateZ(30px) scale(1.04);
    box-shadow:
      5px 5px 10px rgba(0, 0, 0, 0.6),
      -5px -5px 10px rgba(255, 255, 255, 0.2),
      inset 0 -2px 5px rgba(0, 0, 0, 0.7),
      inset 0 2px 5px rgba(255, 255, 255, 0.3);
  }

  /* Active effect */
  .toggle-button:active::before {
    transform: translateZ(20px) scale(0.95);
    box-shadow:
      3px 3px 6px rgba(0, 0, 0, 0.7),
      -3px -3px 6px rgba(255, 255, 255, 0.1),
      inset 0 -2px 5px rgba(0, 0, 0, 0.8),
      inset 0 2px 5px rgba(255, 255, 255, 0.3);
  }

  /* Micro-interaction animations */
  @keyframes track-vibrate {
    0%,
    100% {
      transform: translateZ(0) translateY(0);
    }
    50% {
      transform: translateZ(0) translateY(-1px);
    }
  }

  @keyframes knob-pulse {
    0%,
    100% {
      transform: translateZ(25px) scale(1);
    }
    50% {
      transform: translateZ(25px) scale(1.06);
    }
  }

  @keyframes track-etch {
    0%,
    100% {
      box-shadow: inset 0 0 8px rgba(255, 140, 0, 0.2);
    }
    50% {
      box-shadow: inset 0 0 12px rgba(255, 140, 0, 0.4);
    }
  }

  .toggle-button {
    animation: track-vibrate 0.1s ease-in-out 0.2s 3; /* Haptic feedback */
  }

  .toggle-container input:checked ~ .toggle-button::before {
    animation: knob-pulse 1.6s infinite ease-in-out;
  }

  .toggle-container input:checked ~ .toggle-button::after {
    animation: track-etch 2s infinite ease-in-out;
  }`;

export default Loader;

- Slider buttons : import React from 'react';
import styled from 'styled-components';

const Input = () => {
  return (
    <StyledWrapper>
      <input id="myRange" className="slider" defaultValue={50} max={100} min={0} type="range" />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .slider {
    -webkit-appearance: none;
    width: 100%;
    height: 10px;
    border-radius: 5px;
    background-color: #4158D0;
    background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #4c00ff;
    background-image: linear-gradient(160deg, #4900f5 0%, #80D0C7 100%);
    cursor: pointer;
  }

  .slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #0093E9;
    background-image: linear-gradient(160deg, #0093E9 0%, #80D0C7 100%);
    cursor: pointer;
  }`;

export default Input;

Upload file style: import React from 'react';
import styled from 'styled-components';

const Form = () => {
  return (
    <StyledWrapper>
      <label htmlFor="file" className="custum-file-upload">
        <div className="icon">
          <svg viewBox="0 0 24 24" fill xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" fill /> </g></svg>
        </div>
        <div className="text">
          <span>Click to upload image</span>
        </div>
        <input id="file" type="file" />
      </label>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .custum-file-upload {
    height: 200px;
    width: 300px;
    display: flex;
    flex-direction: column;
    align-items: space-between;
    gap: 20px;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    border: 2px dashed #e8e8e8;
    background-color: #212121;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0px 48px 35px -48px #e8e8e8;
  }

  .custum-file-upload .icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .custum-file-upload .icon svg {
    height: 80px;
    fill: #e8e8e8;
  }

  .custum-file-upload .text {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .custum-file-upload .text span {
    font-weight: 400;
    color: #e8e8e8;
  }

  .custum-file-upload input {
    display: none;
  }`;

export default Form;

- Upload file: 

import React from 'react';
import styled from 'styled-components';

const Input = () => {
  return (
    <StyledWrapper>
      <div className="container">
        <div className="folder">
          <div className="front-side">
            <div className="tip" />
            <div className="cover" />
          </div>
          <div className="back-side cover" />
        </div>
        <label className="custom-file-upload">
          <input className="title" type="file" />
          Choose a file
        </label>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .container {
    --transition: 350ms;
    --folder-W: 120px;
    --folder-H: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding: 10px;
    background: linear-gradient(135deg, #6dd5ed, #2193b0);
    border-radius: 15px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    height: calc(var(--folder-H) * 1.7);
    position: relative;
  }

  .folder {
    position: absolute;
    top: -20px;
    left: calc(50% - 60px);
    animation: float 2.5s infinite ease-in-out;
    transition: transform var(--transition) ease;
  }

  .folder:hover {
    transform: scale(1.05);
  }

  .folder .front-side,
  .folder .back-side {
    position: absolute;
    transition: transform var(--transition);
    transform-origin: bottom center;
  }

  .folder .back-side::before,
  .folder .back-side::after {
    content: "";
    display: block;
    background-color: white;
    opacity: 0.5;
    z-index: 0;
    width: var(--folder-W);
    height: var(--folder-H);
    position: absolute;
    transform-origin: bottom center;
    border-radius: 15px;
    transition: transform 350ms;
    z-index: 0;
  }

  .container:hover .back-side::before {
    transform: rotateX(-5deg) skewX(5deg);
  }
  .container:hover .back-side::after {
    transform: rotateX(-15deg) skewX(12deg);
  }

  .folder .front-side {
    z-index: 1;
  }

  .container:hover .front-side {
    transform: rotateX(-40deg) skewX(15deg);
  }

  .folder .tip {
    background: linear-gradient(135deg, #ff9a56, #ff6f56);
    width: 80px;
    height: 20px;
    border-radius: 12px 12px 0 0;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    position: absolute;
    top: -10px;
    z-index: 2;
  }

  .folder .cover {
    background: linear-gradient(135deg, #ffe563, #ffc663);
    width: var(--folder-W);
    height: var(--folder-H);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }

  .custom-file-upload {
    font-size: 1.1em;
    color: #ffffff;
    text-align: center;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 10px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: background var(--transition) ease;
    display: inline-block;
    width: 100%;
    padding: 10px 35px;
    position: relative;
  }

  .custom-file-upload:hover {
    background: rgba(255, 255, 255, 0.4);
  }

  .custom-file-upload input[type="file"] {
    display: none;
  }

  @keyframes float {
    0% {
      transform: translateY(0px);
    }

    50% {
      transform: translateY(-20px);
    }

    100% {
      transform: translateY(0px);
    }
  }`;

export default Input;

- Cards: 

1) import React from 'react';
import styled from 'styled-components';

const Card = () => {
  return (
    <StyledWrapper>
      <div className="container_chat_bot">
        <div className="container-chat-options">
          <div className="chat">
            <div className="chat-bot">
              <textarea id="chat_bot" name="chat_bot" placeholder="Imagine Something...✦˚" defaultValue={""} />
            </div>
            <div className="options">
              <div className="btns-add">
                <button>
                  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8v8a5 5 0 1 0 10 0V6.5a3.5 3.5 0 1 0-7 0V15a2 2 0 0 0 4 0V8" />
                  </svg>
                </button>
                <button>
                  <svg viewBox="0 0 24 24" height={20} width={20} xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm0 10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zm0-8h6m-3-3v6" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" fill="none" />
                  </svg>
                </button>
                <button>
                  <svg viewBox="0 0 24 24" height={20} width={20} xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m-2.29-2.333A17.9 17.9 0 0 1 8.027 13H4.062a8.01 8.01 0 0 0 5.648 6.667M10.03 13c.151 2.439.848 4.73 1.97 6.752A15.9 15.9 0 0 0 13.97 13zm9.908 0h-3.965a17.9 17.9 0 0 1-1.683 6.667A8.01 8.01 0 0 0 19.938 13M4.062 11h3.965A17.9 17.9 0 0 1 9.71 4.333A8.01 8.01 0 0 0 4.062 11m5.969 0h3.938A15.9 15.9 0 0 0 12 4.248A15.9 15.9 0 0 0 10.03 11m4.259-6.667A17.9 17.9 0 0 1 15.973 11h3.965a8.01 8.01 0 0 0-5.648-6.667" fill="currentColor" />
                  </svg>
                </button>
              </div>
              <button className="btn-submit">
                <i>
                  <svg viewBox="0 0 512 512">
                    <path fill="currentColor" d="M473 39.05a24 24 0 0 0-25.5-5.46L47.47 185h-.08a24 24 0 0 0 1 45.16l.41.13l137.3 58.63a16 16 0 0 0 15.54-3.59L422 80a7.07 7.07 0 0 1 10 10L226.66 310.26a16 16 0 0 0-3.59 15.54l58.65 137.38c.06.2.12.38.19.57c3.2 9.27 11.3 15.81 21.09 16.25h1a24.63 24.63 0 0 0 23-15.46L478.39 64.62A24 24 0 0 0 473 39.05" />
                  </svg>
                </i>
              </button>
            </div>
          </div>
        </div>
        <div className="tags">
          <span>Create An Image</span>
          <span>Analyse Data</span>
          <span>More</span>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .container_chat_bot {
    display: flex;
    flex-direction: column;
    max-width: 260px;
    width: 100%;
  }

  .container_chat_bot .container-chat-options {
    position: relative;
    display: flex;
    background: linear-gradient(
      to bottom right,
      #7e7e7e,
      #363636,
      #363636,
      #363636,
      #363636
    );
    border-radius: 16px;
    padding: 1.5px;
    overflow: hidden;

    &::after {
      position: absolute;
      content: "";
      top: -10px;
      left: -10px;
      background: radial-gradient(
        ellipse at center,
        #ffffff,
        rgba(255, 255, 255, 0.3),
        rgba(255, 255, 255, 0.1),
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0)
      );
      width: 30px;
      height: 30px;
      filter: blur(1px);
    }
  }

  .container_chat_bot .container-chat-options .chat {
    display: flex;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 15px;
    width: 100%;
    overflow: hidden;
  }

  .container_chat_bot .container-chat-options .chat .chat-bot {
    position: relative;
    display: flex;
  }

  .container_chat_bot .chat .chat-bot textarea {
    background-color: transparent;
    border-radius: 16px;
    border: none;
    width: 100%;
    height: 50px;
    color: #ffffff;
    font-family: sans-serif;
    font-size: 12px;
    font-weight: 400;
    padding: 10px;
    resize: none;
    outline: none;

    &::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 5px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #555;
      cursor: pointer;
    }

    &::placeholder {
      color: #f3f6fd;
      transition: all 0.3s ease;
    }
    &:focus::placeholder {
      color: #363636;
    }
  }

  .container_chat_bot .chat .options {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 10px;
  }

  .container_chat_bot .chat .options .btns-add {
    display: flex;
    gap: 8px;

    & button {
      display: flex;
      color: rgba(255, 255, 255, 0.1);
      background-color: transparent;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-5px);
        color: #ffffff;
      }
    }
  }

  .container_chat_bot .chat .options .btn-submit {
    display: flex;
    padding: 2px;
    background-image: linear-gradient(to top, #292929, #555555, #292929);
    border-radius: 10px;
    box-shadow: inset 0 6px 2px -4px rgba(255, 255, 255, 0.5);
    cursor: pointer;
    border: none;
    outline: none;
    transition: all 0.15s ease;

    & i {
      width: 30px;
      height: 30px;
      padding: 6px;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      backdrop-filter: blur(3px);
      color: #8b8b8b;
    }
    & svg {
      transition: all 0.3s ease;
    }
    &:hover svg {
      color: #f3f6fd;
      filter: drop-shadow(0 0 5px #ffffff);
    }

    &:focus svg {
      color: #f3f6fd;
      filter: drop-shadow(0 0 5px #ffffff);
      transform: scale(1.2) rotate(45deg) translateX(-2px) translateY(1px);
    }

    &:active {
      transform: scale(0.92);
    }
  }

  .container_chat_bot .tags {
    padding: 14px 0;
    display: flex;
    color: #ffffff;
    font-size: 10px;
    gap: 4px;

    & span {
      padding: 4px 8px;
      background-color: #1b1b1b;
      border: 1.5px solid #363636;
      border-radius: 10px;
      cursor: pointer;
      user-select: none;
    }
  }`;

export default Card;

2) import React from 'react';
import styled from 'styled-components';

const Card = () => {
  return (
    <StyledWrapper>
      <div className="container">
        <div data-text="Github" style={{-r: -15}} className="glass">
          <svg viewBox="0 0 496 512" height="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
          </svg>
        </div>
        <div data-text="Code" style={{-r: 5}} className="glass">
          <svg viewBox="0 0 640 512" height="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z" />
          </svg>
        </div>
        <div data-text="Earn" style={{-r: 25}} className="glass">
          <svg viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M64 64C28.7 64 0 92.7 0 128V384c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H64zm64 320H64V320c35.3 0 64 28.7 64 64zM64 192V128h64c0 35.3-28.7 64-64 64zM448 384c0-35.3 28.7-64 64-64v64H448zm64-192c-35.3 0-64-28.7-64-64h64v64zM288 160a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" />
          </svg>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .container .glass {
    position: relative;
    width: 180px;
    height: 200px;
    background: linear-gradient(#fff2, transparent);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 25px 25px rgba(0, 0, 0, 0.25);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.5s;
    border-radius: 10px;
    margin: 0 -45px;
    backdrop-filter: blur(10px);
    transform: rotate(calc(var(--r) * 1deg));
  }

  .container:hover .glass {
    transform: rotate(0deg);
    margin: 0 10px;
  }

  .container .glass::before {
    content: attr(data-text);
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40px;
    background: rgba(255, 255, 255, 0.05);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }
  .container .glass svg {
    font-size: 2.5em;
    fill: #fff;
  }`;

export default Card;

3) import React from 'react';
import styled from 'styled-components';

const Card = () => {
  return (
    <StyledWrapper>
      <div className="card">
        <div className="title">
          <span>
            <svg width={20} fill="currentColor" height={20} viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
              <path d="M1362 1185q0 153-99.5 263.5t-258.5 136.5v175q0 14-9 23t-23 9h-135q-13 0-22.5-9.5t-9.5-22.5v-175q-66-9-127.5-31t-101.5-44.5-74-48-46.5-37.5-17.5-18q-17-21-2-41l103-135q7-10 23-12 15-2 24 9l2 2q113 99 243 125 37 8 74 8 81 0 142.5-43t61.5-122q0-28-15-53t-33.5-42-58.5-37.5-66-32-80-32.5q-39-16-61.5-25t-61.5-26.5-62.5-31-56.5-35.5-53.5-42.5-43.5-49-35.5-58-21-66.5-8.5-78q0-138 98-242t255-134v-180q0-13 9.5-22.5t22.5-9.5h135q14 0 23 9t9 23v176q57 6 110.5 23t87 33.5 63.5 37.5 39 29 15 14q17 18 5 38l-81 146q-8 15-23 16-14 3-27-7-3-3-14.5-12t-39-26.5-58.5-32-74.5-26-85.5-11.5q-95 0-155 43t-60 111q0 26 8.5 48t29.5 41.5 39.5 33 56 31 60.5 27 70 27.5q53 20 81 31.5t76 35 75.5 42.5 62 50 53 63.5 31.5 76.5 13 94z">
              </path>
            </svg>
          </span>
          <p className="title-text">
            Sales
          </p>
          <p className="percent">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792" fill="currentColor" height={20} width={20}>
              <path d="M1408 1216q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z">
              </path>
            </svg> 20%
          </p>
        </div>
        <div className="data">
          <p>
            39,500 
          </p>
          <div className="range">
            <div className="fill">
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
    padding: 1rem;
    background-color: #fff;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    max-width: 320px;
    border-radius: 20px;
  }

  .title {
    display: flex;
    align-items: center;
  }

  .title span {
    position: relative;
    padding: 0.5rem;
    background-color: #10B981;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 9999px;
  }

  .title span svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #ffffff;
    height: 1rem;
  }

  .title-text {
    margin-left: 0.5rem;
    color: #374151;
    font-size: 18px;
  }

  .percent {
    margin-left: 0.5rem;
    color: #02972f;
    font-weight: 600;
    display: flex;
  }

  .data {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .data p {
    margin-top: 1rem;
    margin-bottom: 1rem;
    color: #1F2937;
    font-size: 2.25rem;
    line-height: 2.5rem;
    font-weight: 700;
    text-align: left;
  }

  .data .range {
    position: relative;
    background-color: #E5E7EB;
    width: 100%;
    height: 0.5rem;
    border-radius: 0.25rem;
  }

  .data .range .fill {
    position: absolute;
    top: 0;
    left: 0;
    background-color: #10B981;
    width: 76%;
    height: 100%;
    border-radius: 0.25rem;
  }`;

export default Card;

4) import React from 'react';
import styled from 'styled-components';

const Card = () => {
  return (
    <StyledWrapper>
      <div className="card" />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
    width: 190px;
    height: 254px;
    background: rgb(223, 225, 235);
    border-radius: 50px;
    box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;
  }`;

export default Card;

5) import React from 'react';
import styled from 'styled-components';

const Card = () => {
  return (
    <StyledWrapper>
      <div className="card">
        <div className="content">
          <div className="back">
            <div className="back-content">
              <svg stroke="#ffffff" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" height="50px" width="50px" fill="#ffffff">
                <g strokeWidth={0} id="SVGRepo_bgCarrier" />
                <g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier" />
                <g id="SVGRepo_iconCarrier">
                  <path d="M20.84375 0.03125C20.191406 0.0703125 19.652344 0.425781 19.21875 1.53125C18.988281 2.117188 18.5 3.558594 18.03125 4.9375C17.792969 5.636719 17.570313 6.273438 17.40625 6.75C17.390625 6.796875 17.414063 6.855469 17.40625 6.90625C17.398438 6.925781 17.351563 6.949219 17.34375 6.96875L17.25 7.25C18.566406 7.65625 19.539063 8.058594 19.625 8.09375C22.597656 9.21875 28.351563 11.847656 33.28125 16.78125C38.5 22 41.183594 28.265625 42.09375 30.71875C42.113281 30.761719 42.375 31.535156 42.75 32.84375C42.757813 32.839844 42.777344 32.847656 42.78125 32.84375C43.34375 32.664063 44.953125 32.09375 46.3125 31.625C47.109375 31.351563 47.808594 31.117188 48.15625 31C49.003906 30.714844 49.542969 30.292969 49.8125 29.6875C50.074219 29.109375 50.066406 28.429688 49.75 27.6875C49.605469 27.347656 49.441406 26.917969 49.25 26.4375C47.878906 23.007813 45.007813 15.882813 39.59375 10.46875C33.613281 4.484375 25.792969 1.210938 22.125 0.21875C21.648438 0.0898438 21.234375 0.0078125 20.84375 0.03125 Z M 16.46875 9.09375L0.0625 48.625C-0.09375 48.996094 -0.00390625 49.433594 0.28125 49.71875C0.472656 49.910156 0.738281 50 1 50C1.128906 50 1.253906 49.988281 1.375 49.9375L40.90625 33.59375C40.523438 32.242188 40.222656 31.449219 40.21875 31.4375C39.351563 29.089844 36.816406 23.128906 31.875 18.1875C27.035156 13.34375 21.167969 10.804688 18.875 9.9375C18.84375 9.925781 17.8125 9.5 16.46875 9.09375 Z M 17 16C19.761719 16 22 18.238281 22 21C22 23.761719 19.761719 26 17 26C15.140625 26 13.550781 24.972656 12.6875 23.46875L15.6875 16.1875C16.101563 16.074219 16.550781 16 17 16 Z M 31 22C32.65625 22 34 23.34375 34 25C34 25.917969 33.585938 26.730469 32.9375 27.28125L32.90625 27.28125C33.570313 27.996094 34 28.949219 34 30C34 32.210938 32.210938 34 30 34C27.789063 34 26 32.210938 26 30C26 28.359375 26.996094 26.960938 28.40625 26.34375L28.3125 26.3125C28.117188 25.917969 28 25.472656 28 25C28 23.34375 29.34375 22 31 22 Z M 21 32C23.210938 32 25 33.789063 25 36C25 36.855469 24.710938 37.660156 24.25 38.3125L20.3125 39.9375C18.429688 39.609375 17 37.976563 17 36C17 33.789063 18.789063 32 21 32 Z M 9 34C10.65625 34 12 35.34375 12 37C12 38.65625 10.65625 40 9 40C7.902344 40 6.960938 39.414063 6.4375 38.53125L8.25 34.09375C8.488281 34.03125 8.742188 34 9 34Z" />
                </g>
              </svg>
              <strong>Hover Me</strong>
            </div>
          </div>
          <div className="front">
            <div className="img">
              <div className="circle">
              </div>
              <div className="circle" id="right">
              </div>
              <div className="circle" id="bottom">
              </div>
            </div>
            <div className="front-content">
              <small className="badge">Pasta</small>
              <div className="description">
                <div className="title">
                  <p className="title">
                    <strong>Spaguetti Bolognese</strong>
                  </p>
                  <svg fillRule="nonzero" height="15px" width="15px" viewBox="0,0,256,256" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><g style={{mixBlendMode: 'normal'}} textAnchor="none" fontSize="none" fontWeight="none" fontFamily="none" strokeDashoffset={0} strokeDasharray strokeMiterlimit={10} strokeLinejoin="miter" strokeLinecap="butt" strokeWidth={1} stroke="none" fillRule="nonzero" fill="#20c997"><g transform="scale(8,8)"><path d="M25,27l-9,-6.75l-9,6.75v-23h18z" /></g></g></svg>
                </div>
                <p className="card-footer">
                  30 Mins &nbsp; | &nbsp; 1 Serving
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
    overflow: visible;
    width: 190px;
    height: 254px;
  }

  .content {
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 300ms;
    box-shadow: 0px 0px 10px 1px #000000ee;
    border-radius: 5px;
  }

  .front, .back {
    background-color: #151515;
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    border-radius: 5px;
    overflow: hidden;
  }

  .back {
    width: 100%;
    height: 100%;
    justify-content: center;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .back::before {
    position: absolute;
    content: ' ';
    display: block;
    width: 160px;
    height: 160%;
    background: linear-gradient(90deg, transparent, #ff9966, #ff9966, #ff9966, #ff9966, transparent);
    animation: rotation_481 5000ms infinite linear;
  }

  .back-content {
    position: absolute;
    width: 99%;
    height: 99%;
    background-color: #151515;
    border-radius: 5px;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
  }

  .card:hover .content {
    transform: rotateY(180deg);
  }

  @keyframes rotation_481 {
    0% {
      transform: rotateZ(0deg);
    }

    0% {
      transform: rotateZ(360deg);
    }
  }

  .front {
    transform: rotateY(180deg);
    color: white;
  }

  .front .front-content {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .front-content .badge {
    background-color: #00000055;
    padding: 2px 10px;
    border-radius: 10px;
    backdrop-filter: blur(2px);
    width: fit-content;
  }

  .description {
    box-shadow: 0px 0px 10px 5px #00000088;
    width: 100%;
    padding: 10px;
    background-color: #00000099;
    backdrop-filter: blur(5px);
    border-radius: 5px;
  }

  .title {
    font-size: 11px;
    max-width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .title p {
    width: 50%;
  }

  .card-footer {
    color: #ffffff88;
    margin-top: 5px;
    font-size: 8px;
  }

  .front .img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .circle {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background-color: #ffbb66;
    position: relative;
    filter: blur(15px);
    animation: floating 2600ms infinite linear;
  }

  #bottom {
    background-color: #ff8866;
    left: 50px;
    top: 0px;
    width: 150px;
    height: 150px;
    animation-delay: -800ms;
  }

  #right {
    background-color: #ff2233;
    left: 160px;
    top: -80px;
    width: 30px;
    height: 30px;
    animation-delay: -1800ms;
  }

  @keyframes floating {
    0% {
      transform: translateY(0px);
    }

    50% {
      transform: translateY(10px);
    }

    100% {
      transform: translateY(0px);
    }
  }`;

export default Card;

6) import React from 'react';
import styled from 'styled-components';

const Card = () => {
  return (
    <StyledWrapper>
      <div className="outer">
        <div className="dot" />
        <div className="card">
          <div className="ray" />
          <div className="text">750k</div>
          <div>Views</div>
          <div className="line topl" />
          <div className="line leftl" />
          <div className="line bottoml" />
          <div className="line rightl" />
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .outer {
    width: 300px;
    height: 250px;
    border-radius: 10px;
    padding: 1px;
    background: radial-gradient(circle 230px at 0% 0%, #ffffff, #0c0d0d);
    position: relative;
  }

  .dot {
    width: 5px;
    aspect-ratio: 1;
    position: absolute;
    background-color: #fff;
    box-shadow: 0 0 10px #ffffff;
    border-radius: 100px;
    z-index: 2;
    right: 10%;
    top: 10%;
    animation: moveDot 6s linear infinite;
  }

  @keyframes moveDot {
    0%,
    100% {
      top: 10%;
      right: 10%;
    }
    25% {
      top: 10%;
      right: calc(100% - 35px);
    }
    50% {
      top: calc(100% - 30px);
      right: calc(100% - 35px);
    }
    75% {
      top: calc(100% - 30px);
      right: 10%;
    }
  }

  .card {
    z-index: 1;
    width: 100%;
    height: 100%;
    border-radius: 9px;
    border: solid 1px #202222;
    background-size: 20px 20px;
    background: radial-gradient(circle 280px at 0% 0%, #444444, #0c0d0d);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    flex-direction: column;
    color: #fff;
  }
  .ray {
    width: 220px;
    height: 45px;
    border-radius: 100px;
    position: absolute;
    background-color: #c7c7c7;
    opacity: 0.4;
    box-shadow: 0 0 50px #fff;
    filter: blur(10px);
    transform-origin: 10%;
    top: 0%;
    left: 0;
    transform: rotate(40deg);
  }

  .card .text {
    font-weight: bolder;
    font-size: 4rem;
    background: linear-gradient(45deg, #000000 4%, #fff, #000);
    background-clip: text;
    color: transparent;
  }

  .line {
    width: 100%;
    height: 1px;
    position: absolute;
    background-color: #2c2c2c;
  }
  .topl {
    top: 10%;
    background: linear-gradient(90deg, #888888 30%, #1d1f1f 70%);
  }
  .bottoml {
    bottom: 10%;
  }
  .leftl {
    left: 10%;
    width: 1px;
    height: 100%;
    background: linear-gradient(180deg, #747474 30%, #222424 70%);
  }
  .rightl {
    right: 10%;
    width: 1px;
    height: 100%;
  }`;

export default Card;

7) import React from 'react';
import styled from 'styled-components';

const Card = () => {
  return (
    <StyledWrapper>
      <div className="card" />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
   width: 190px;
   height: 254px;
   border-radius: 30px;
   background: #212121;
   box-shadow: 15px 15px 30px rgb(25, 25, 25),
               -15px -15px 30px rgb(60, 60, 60);
  }`;

export default Card;

8) import React from 'react';
import styled from 'styled-components';

const Card = () => {
  return (
    <StyledWrapper>
      <div className="container">
        <div className="card_box">
          <span />
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card_box {
    width: 200px;
    height: 250px;
    border-radius: 20px;
    background: linear-gradient(170deg, rgba(58, 56, 56, 0.623) 0%, rgb(31, 31, 31) 100%);
    position: relative;
    box-shadow: 0 25px 50px rgba(0,0,0,0.55);
    cursor: pointer;
    transition: all .3s;
  }

  .card_box:hover {
    transform: scale(0.9);
  }

  .card_box span {
    position: absolute;
    overflow: hidden;
    width: 150px;
    height: 150px;
    top: -10px;
    left: -10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card_box span::before {
    content: 'Premium';
    position: absolute;
    width: 150%;
    height: 40px;
    background-image: linear-gradient(45deg, #ff6547 0%, #ffb144  51%, #ff7053  100%);
    transform: rotate(-45deg) translateY(-20px);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    box-shadow: 0 5px 10px rgba(0,0,0,0.23);
  }

  .card_box span::after {
    content: '';
    position: absolute;
    width: 10px;
    bottom: 0;
    left: 0;
    height: 10px;
    z-index: -1;
    box-shadow: 140px -140px #cc3f47;
    background-image: linear-gradient(45deg, #FF512F 0%, #F09819  51%, #FF512F  100%);
  }`;

export default Card;

Load buttons: import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader">
        <div className="loader-bar bar-1" />
        <div className="loader-bar bar-2" />
        <div className="loader-bar bar-3" />
        <div className="loader-bar bar-4" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .loader {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .loader-bar {
    height: 25px;
    width: 6px;
    margin: 0 3px;
    border-radius: 20px;
    animation: loader 2s ease-in-out infinite;
  }

  .bar-1 {
    background: linear-gradient(to right, #00e6e6, #00ccff, #0099ff, #0066ff);
    animation-delay: 0s;
    box-shadow: 0px 0px 15px 3px #00e6e6;
  }

  .bar-2 {
    background: linear-gradient(to right, #00ccff, #0099ff, #0066ff, #00e6e6);
    animation-delay: 0.1s;
    box-shadow: 0px 0px 15px 3px #00ccff;
  }

  .bar-3 {
    background: linear-gradient(to right, #0099ff, #0066ff, #00e6e6, #00ccff);
    animation-delay: 0.2s;
    box-shadow: 0px 0px 15px 3px #0099ff;
  }

  .bar-4 {
    background: linear-gradient(to right, #0066ff, #00e6e6, #00ccff, #0099ff);
    animation-delay: 0.3s;
    box-shadow: 0px 0px 15px 3px #0066ff;
  }

  @keyframes loader {
    0% {
      transform: scaleY(1);
    }

    50% {
      transform: scaleY(2);
    }

    100% {
      transform: scaleY(1);
    }
  }`;

export default Loader;

 and this one: 

import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="container">
        <div className="loader" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .loader {
    width: 60%;
    height: 10px;
    border-radius: 2px;
    background-color: rgba(0, 0, 0, 0.2);
    position: absolute;
  }

  .loader::before {
    content: "";
    position: absolute;
    background-color: rgb(9, 188, 9);
    width: 0%;
    height: 100%;
    border-radius: 2px;
    animation: load 3.5s ease-in-out infinite;
    box-shadow: rgb(9, 188, 9) 0px 2px 29px 0px;
  }

  .container {
    display: flex;
    justify-content: center;
  }

  @keyframes load {
    50% {
      width: 100%;
    }

    100% {
      right: 0;
      left: unset;
    }
  }`;

export default Loader;


Navigation:

1) menu nav: import React from 'react';

const Button = () => {
  return (
    <div className="hover:scale-x-105 transition-all duration-300 *:transition-all *:duration-300 flex justify-start text-2xl items-center shadow-xl z-10 bg-[#e8e4df] dark:bg-[#191818] gap-2 p-2 rounded-full">
      <button className="before:hidden hover:before:flex before:justify-center before:items-center before:h-4 before:text-[.6rem] before:px-1 before:content-['Like'] before:bg-black dark:before:bg-white dark:before:text-black before:text-white before:bg-opacity-50 before:absolute before:-top-7 before:rounded-lg hover:-translate-y-5 cursor-pointer hover:scale-125 bg-white dark:bg-[#191818] rounded-full p-2 px-3">
        👍
      </button>
      <button className="before:hidden hover:before:flex before:justify-center before:items-center before:h-4 before:text-[.6rem] before:px-1 before:content-['Cheer'] before:bg-black dark:before:bg-white dark:before:text-black before:text-white before:bg-opacity-50 before:absolute before:-top-7 before:rounded-lg hover:-translate-y-5 cursor-pointer hover:scale-125 bg-white dark:bg-[#191818] rounded-full p-2 px-3">
        👏🏻
      </button>
      <button className="before:hidden hover:before:flex before:justify-center before:items-center before:h-4 before:text-[.6rem] before:px-1 before:content-['Celebrate'] before:bg-black dark:before:bg-white dark:before:text-black before:text-white before:bg-opacity-50 before:absolute before:-top-7 before:rounded-lg hover:-translate-y-5 cursor-pointer hover:scale-125 bg-white dark:bg-[#191818] rounded-full p-2 px-3">
        🎉
      </button>
      <button className="before:hidden hover:before:flex before:justify-center before:items-center before:h-4 before:text-[.6rem] before:px-1 before:content-['Appreciate'] before:bg-black dark:before:bg-white dark:before:text-black before:text-white before:bg-opacity-50 before:absolute before:-top-7 before:rounded-lg hover:-translate-y-5 cursor-pointer hover:scale-125 bg-white dark:bg-[#191818] rounded-full p-2 px-3">
        ✨
      </button>
      <button className="before:hidden hover:before:flex before:justify-center before:items-center before:h-4 before:text-[.6rem] before:px-1 before:content-['Smile'] before:bg-black dark:before:bg-white dark:before:text-black before:text-white before:bg-opacity-50 before:absolute before:-top-7 before:rounded-lg hover:-translate-y-5 cursor-pointer hover:scale-125 bg-white dark:bg-[#191818] rounded-full p-2 px-3">
        🙂
      </button>
    </div>
  );
}

export default Button;

2) import React from 'react';
import styled from 'styled-components';

const Button = () => {
  return (
    <StyledWrapper>
      <div className="button-container">
        <button className="button">
          <svg className="icon" stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z" />
          </svg>
        </button>
        <button className="button">
          <svg className="icon" stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button className="button">
          <svg className="icon" stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.5a5.5 5.5 0 0 1 3.096 10.047 9.005 9.005 0 0 1 5.9 8.181.75.75 0 1 1-1.499.044 7.5 7.5 0 0 0-14.993 0 .75.75 0 0 1-1.5-.045 9.005 9.005 0 0 1 5.9-8.18A5.5 5.5 0 0 1 12 2.5ZM8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z" />
          </svg>
        </button>
        <button className="button">
          <svg className="icon" stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <circle cx={9} cy={21} r={1} />
            <circle cx={20} cy={21} r={1} />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </button>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .button-container {
    display: flex;
    background-color: black;
    width: 250px;
    height: 40px;
    align-items: center;
    justify-content: space-around;
    border-radius: 10px;
  }

  .button {
    outline: 0 !important;
    border: 0 !important;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    transition: all ease-in-out 0.3s;
    cursor: pointer;
  }

  .button:hover {
    transform: translateY(-3px);
  }

  .icon {
    font-size: 20px;
  }`;

export default Button;

3) import React from 'react';

const Input = () => {
  return (
    <form className="form relative">
      <button className="absolute left-2 -translate-y-1/2 top-1/2 p-1">
        <svg width={17} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="search" className="w-5 h-5 text-gray-700">
          <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <input className="input rounded-full px-8 py-3 border-2 border-transparent focus:outline-none focus:border-blue-500 placeholder-gray-400 transition-all duration-300 shadow-md" placeholder="Search..." required type="text" />
      <button type="reset" className="absolute right-3 -translate-y-1/2 top-1/2 p-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </form>
  );
}

export default Input;

4) import React from 'react';
import styled from 'styled-components';

const Card = () => {
  return (
    <StyledWrapper>
      <div className="menu">
        <a href className="active">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
            <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
          </svg>
          <span>Home</span>
        </a>
        <a href>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
          </svg>
          <span>Files</span>
        </a>
        <a href>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clipRule="evenodd" />
          </svg>
          <span>Plans</span>
        </a>
        <a href>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path d="M17.004 10.407c.138.435-.216.842-.672.842h-3.465a.75.75 0 0 1-.65-.375l-1.732-3c-.229-.396-.053-.907.393-1.004a5.252 5.252 0 0 1 6.126 3.537ZM8.12 8.464c.307-.338.838-.235 1.066.16l1.732 3a.75.75 0 0 1 0 .75l-1.732 3c-.229.397-.76.5-1.067.161A5.23 5.23 0 0 1 6.75 12a5.23 5.23 0 0 1 1.37-3.536ZM10.878 17.13c-.447-.098-.623-.608-.394-1.004l1.733-3.002a.75.75 0 0 1 .65-.375h3.465c.457 0 .81.407.672.842a5.252 5.252 0 0 1-6.126 3.539Z" />
            <path fillRule="evenodd" d="M21 12.75a.75.75 0 1 0 0-1.5h-.783a8.22 8.22 0 0 0-.237-1.357l.734-.267a.75.75 0 1 0-.513-1.41l-.735.268a8.24 8.24 0 0 0-.689-1.192l.6-.503a.75.75 0 1 0-.964-1.149l-.6.504a8.3 8.3 0 0 0-1.054-.885l.391-.678a.75.75 0 1 0-1.299-.75l-.39.676a8.188 8.188 0 0 0-1.295-.47l.136-.77a.75.75 0 0 0-1.477-.26l-.136.77a8.36 8.36 0 0 0-1.377 0l-.136-.77a.75.75 0 1 0-1.477.26l.136.77c-.448.121-.88.28-1.294.47l-.39-.676a.75.75 0 0 0-1.3.75l.392.678a8.29 8.29 0 0 0-1.054.885l-.6-.504a.75.75 0 1 0-.965 1.149l.6.503a8.243 8.243 0 0 0-.689 1.192L3.8 8.216a.75.75 0 1 0-.513 1.41l.735.267a8.222 8.222 0 0 0-.238 1.356h-.783a.75.75 0 0 0 0 1.5h.783c.042.464.122.917.238 1.356l-.735.268a.75.75 0 0 0 .513 1.41l.735-.268c.197.417.428.816.69 1.191l-.6.504a.75.75 0 0 0 .963 1.15l.601-.505c.326.323.679.62 1.054.885l-.392.68a.75.75 0 0 0 1.3.75l.39-.679c.414.192.847.35 1.294.471l-.136.77a.75.75 0 0 0 1.477.261l.137-.772a8.332 8.332 0 0 0 1.376 0l.136.772a.75.75 0 1 0 1.477-.26l-.136-.771a8.19 8.19 0 0 0 1.294-.47l.391.677a.75.75 0 0 0 1.3-.75l-.393-.679a8.29 8.29 0 0 0 1.054-.885l.601.504a.75.75 0 0 0 .964-1.15l-.6-.503c.261-.375.492-.774.69-1.191l.735.267a.75.75 0 1 0 .512-1.41l-.734-.267c.115-.439.195-.892.237-1.356h.784Zm-2.657-3.06a6.744 6.744 0 0 0-1.19-2.053 6.784 6.784 0 0 0-1.82-1.51A6.705 6.705 0 0 0 12 5.25a6.8 6.8 0 0 0-1.225.11 6.7 6.7 0 0 0-2.15.793 6.784 6.784 0 0 0-2.952 3.489.76.76 0 0 1-.036.098A6.74 6.74 0 0 0 5.251 12a6.74 6.74 0 0 0 3.366 5.842l.009.005a6.704 6.704 0 0 0 2.18.798l.022.003a6.792 6.792 0 0 0 2.368-.004 6.704 6.704 0 0 0 2.205-.811 6.785 6.785 0 0 0 1.762-1.484l.009-.01.009-.01a6.743 6.743 0 0 0 1.18-2.066c.253-.707.39-1.469.39-2.263a6.74 6.74 0 0 0-.408-2.309Z" clipRule="evenodd" />
          </svg>
          <span>Settings</span>
        </a>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .menu {
    /* position: fixed;
    left: 50%;
    bottom: 12px;
    bottom: calc(12px + env(safe-area-inset-bottom)); */
    /* transform: translateX(-50%); */
    width: calc(100% - 20px);
    max-width: 520px;
    backdrop-filter: blur(12px) saturate(180%) contrast(200%);
    -webkit-backdrop-filter: blur(12px) saturate(180%) contrast(200%);
    background: rgba(0, 122, 255, 0.404);
    border: 1px solid var(--glass-border);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
    padding: 8px;
    border-radius: 99rem;
    display: flex;
    justify-content: center;
    gap: 8px;
    z-index: 50;
  }

  .menu::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow:
      inset 2px 2px 5px -2px rgba(255, 255, 255, 0.4),
      inset -2px -2px 5px 2px rgba(255, 255, 255, 0.4),
      inset 0 -2px 0 rgba(255, 255, 255, 0.2);
    pointer-events: none;
    z-index: -1;
  }

  .menu a {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1 1 0;
    min-width: 0;
    color: rgba(255, 255, 255, 90%);
    text-decoration: none;
    padding: 10px 6px;
    border-radius: 999rem;
    -webkit-tap-highlight-color: transparent;
    transition:
      background 0.18s var(--ease-spring),
      color 0.18s var(--ease-spring),
      transform 0.18s var(--ease-spring),
      box-shadow 0.3s ease-in-out;
  }

  .menu a:hover {
    transition:
      background 0.18s var(--ease-spring),
      color 0.18s var(--ease-spring),
      transform 0.18s var(--ease-spring),
      box-shadow 0.3s ease-in-out;
    background-color: rgba(255, 255, 255, 30%);
    box-shadow:
      inset 2px 2px 5px -2px rgba(255, 255, 255, 0.4),
      inset -2px -1px 5px 0 rgba(255, 255, 255, 0.4),
      inset 0 -2px 0 rgba(255, 255, 255, 0.2);
    transform: rotate(2.2);
    color: rgba(0, 122, 255, 70%);
  }

  .menu a svg {
    width: 1.4rem;
    font-size: 1.4rem;
  }

  .menu a span {
    font-size: 0.8rem;
    font-weight: 600;
    line-height: 1;
    margin-top: 4px;
  }

  .menu a.active {
    background: rgb(237, 237, 237, 60%);
    color: rgba(0, 122, 255, 90%);
  }

  .menu a:active {
    transform: scale(0.98);
  }`;

export default Card;

5) import React from 'react';
import styled from 'styled-components';

const Switch = () => {
  return (
    <StyledWrapper>
      <div className="cyber-signboard">
        <div className="cyber-switch">
          <input type="radio" id="cyber-opt-1" name="cyber-mode" defaultChecked />
          <label htmlFor="cyber-opt-1" className="cyber-label">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <rect x={3} y={3} width={7} height={9} />
              <rect x={14} y={3} width={7} height={5} />
              <rect x={14} y={12} width={7} height={9} />
              <rect x={3} y={16} width={7} height={5} />
            </svg>
            <span className="glare" />
          </label>
          <input type="radio" id="cyber-opt-2" name="cyber-mode" />
          <label htmlFor="cyber-opt-2" className="cyber-label">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="glare" />
          </label>
          <input type="radio" id="cyber-opt-3" name="cyber-mode" />
          <label htmlFor="cyber-opt-3" className="cyber-label">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx={12} cy={7} r={4} />
            </svg>
            <span className="glare" />
          </label>
          <div className="cyber-highlight">
            <div className="highlight-inner" />
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /* Container Layout */
  .cyber-signboard {
    /* System Design Variables */
    --primary-glow: #00f0ff;
    --secondary-glow: #7000ff;
    --inactive-color: #5c6b7f;
    --bg-dark: #0f1016;
    --switch-width: 280px;
    --switch-height: 80px;
    --padding: 6px;

    --item-width: calc((var(--switch-width) - (var(--padding) * 2)) / 3);

    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    font-family: sans-serif;
  }

  .cyber-switch {
    position: relative;
    width: var(--switch-width);
    height: var(--switch-height);
    background: var(--bg-dark);
    border-radius: 20px;
    box-shadow:
      inset 0 2px 4px rgba(0, 0, 0, 0.8),
      inset 0 -1px 2px rgba(255, 255, 255, 0.05),
      0 20px 40px -10px rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    padding: var(--padding);
    box-sizing: border-box;
    overflow: hidden;
    border: 1px solid #1f222e;
  }

  .cyber-switch input[type="radio"] {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .cyber-label {
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 2;
    position: relative;
    border-radius: 14px;
    transition: all 0.3s ease;
    -webkit-tap-highlight-color: transparent;
  }

  /* Icons Style */
  .cyber-label .icon {
    width: 28px;
    height: 28px;
    color: var(--inactive-color);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
  }

  /* The Sliding Highlight */
  .cyber-highlight {
    position: absolute;
    top: var(--padding);
    left: var(--padding);
    width: var(--item-width);
    height: calc(var(--switch-height) - (var(--padding) * 2));
    background: transparent;
    z-index: 1;
    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    pointer-events: none;
  }

  .highlight-inner {
    width: 100%;
    height: 100%;
    border-radius: 14px;
    background: linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.02) 100%
    );
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow:
      0 0 20px var(--primary-glow),
      inset 0 0 15px rgba(0, 240, 255, 0.2);
    backdrop-filter: blur(4px);
    position: relative;
  }

  .highlight-inner::after {
    content: "";
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.8),
      transparent
    );
    opacity: 0.8;
  }

  /* Interaction Logic */
  /* State 1 */
  #cyber-opt-1:checked ~ .cyber-highlight {
    transform: translateX(0%);
  }
  #cyber-opt-1:checked ~ [for="cyber-opt-1"] .icon {
    color: #fff;
    filter: drop-shadow(0 0 8px var(--primary-glow));
    transform: scale(1.1);
  }

  /* State 2 */
  #cyber-opt-2:checked ~ .cyber-highlight {
    transform: translateX(100%);
  }
  #cyber-opt-2:checked ~ [for="cyber-opt-2"] .icon {
    color: #fff;
    filter: drop-shadow(0 0 8px var(--primary-glow));
    transform: scale(1.1);
  }

  /* State 3 */
  #cyber-opt-3:checked ~ .cyber-highlight {
    transform: translateX(200%);
  }
  #cyber-opt-3:checked ~ [for="cyber-opt-3"] .icon {
    color: #fff;
    filter: drop-shadow(0 0 8px var(--primary-glow));
    transform: scale(1.1);
  }

  /* Focus States for Accessibility */
  .cyber-switch input:focus-visible ~ .cyber-highlight .highlight-inner {
    border: 1px solid #fff;
    box-shadow: 0 0 30px var(--primary-glow);
  }

  .cyber-label:hover .icon {
    color: #aeb9cc;
  }

  .cyber-label:active .icon {
    transform: scale(0.95);
  }

  .glare {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 14px;
    background: radial-gradient(
      circle at 50% -20%,
      rgba(255, 255, 255, 0.1),
      transparent 60%
    );
    opacity: 0;
    transition: opacity 0.3s;
  }
  .cyber-label:hover .glare {
    opacity: 1;
  }

  @keyframes neon-pulse {
    0%,
    100% {
      box-shadow:
        0 0 20px var(--primary-glow),
        inset 0 0 15px rgba(0, 240, 255, 0.2);
    }
    50% {
      box-shadow:
        0 0 25px var(--primary-glow),
        inset 0 0 20px rgba(0, 240, 255, 0.3);
    }
  }

  .highlight-inner {
    animation: neon-pulse 3s infinite ease-in-out;
  }`;

export default Switch;

- List and tables: 

import React from 'react';
import styled from 'styled-components';

const Card = () => {
  return (
    <StyledWrapper>
      <div className="card">
        <div className="img" />
        <div className="textBox">
          <div className="textContent">
            <p className="h1">Clans of Clash</p>
            <span className="span">12 min ago</span>
          </div>
          <p className="p">Xhattmahs is not attacking your base!</p>
          <div>
          </div></div></div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
    width: 100%;
    max-width: 290px;
    height: 70px;
    background: #353535;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: left;
    backdrop-filter: blur(10px);
    transition: 0.5s ease-in-out;
  }

  .card:hover {
    cursor: pointer;
    transform: scale(1.05);
  }

  .img {
    width: 50px;
    height: 50px;
    margin-left: 10px;
    border-radius: 10px;
    background: linear-gradient(#d7cfcf, #9198e5);
  }

  .card:hover > .img {
    transition: 0.5s ease-in-out;
    background: linear-gradient(#9198e5, #712020);
  }

  .textBox {
    width: calc(100% - 90px);
    margin-left: 10px;
    color: white;
    font-family: 'Poppins' sans-serif;
  }

  .textContent {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .span {
    font-size: 10px;
  }

  .h1 {
    font-size: 16px;
    font-weight: bold;
  }

  .p {
    font-size: 12px;
    font-weight: lighter;
  }`;

export default Card;

2) import React from 'react';
import styled from 'styled-components';

const Card = () => {
  return (
    <StyledWrapper>
      <div className="notification-container">
        <div className="notification-card notification-top">
          <svg className="notification-svg">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: 'rgba(255,255,255,0.08)'}} />
                <stop offset="50%" style={{stopColor: 'rgba(255,255,255,0.04)'}} />
                <stop offset="100%" style={{stopColor: 'rgba(255,255,255,0.02)'}} />
              </linearGradient>
            </defs>
            <path d="M 0,40 C 0,0 0,0 40,0 L 340,0 C 380,0 380,0 380,40 C 380,80 380,80 340,80 L 40,80 C 0,80 0,80 0,40 Z" fill="url(#grad1)" stroke="rgba(255,255,255,0.15)" strokeWidth={1} className="notification-path glass-effect" />
          </svg>
          <div className="notification-content">
            <div className="notification-avatar">
              <svg width={20} height={20} fill="rgba(255,255,255,0.8)" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="notification-body">
              <div className="notification-header">
                <div className="notification-title">Meeting Reminder</div>
                <div className="notification-time">now</div>
              </div>
              <div className="notification-message">
                Team standup starts in 15 minutes
              </div>
              <div className="notification-meta">
                Conference Room A • Zoom Link Available
              </div>
            </div>
          </div>
        </div>
        <div className="notification-card notification-middle">
          <svg className="notification-svg">
            <defs>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: 'rgba(255,255,255,0.06)'}} />
                <stop offset="50%" style={{stopColor: 'rgba(255,255,255,0.03)'}} />
                <stop offset="100%" style={{stopColor: 'rgba(255,255,255,0.01)'}} />
              </linearGradient>
            </defs>
            <path d="M 0,40 C 0,0 0,0 40,0 L 340,0 C 380,0 380,0 380,40 C 380,80 380,80 340,80 L 40,80 C 0,80 0,80 0,40 Z" fill="url(#grad2)" stroke="rgba(255,255,255,0.12)" strokeWidth={1} className="notification-path glass-effect" />
          </svg>
          <div className="notification-content">
            <div className="notification-avatar">
              <svg width={18} height={18} fill="rgba(255,255,255,0.8)" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <div className="notification-body">
              <div className="notification-header">
                <div className="notification-title">New Email</div>
                <div className="notification-time">2m</div>
              </div>
              <div className="notification-message">
                Project update from Sarah Johnson
              </div>
            </div>
          </div>
        </div>
        <div className="notification-card notification-bottom">
          <svg className="notification-svg">
            <defs>
              <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: 'rgba(255,255,255,0.04)'}} />
                <stop offset="50%" style={{stopColor: 'rgba(255,255,255,0.02)'}} />
                <stop offset="100%" style={{stopColor: 'rgba(255,255,255,0.01)'}} />
              </linearGradient>
            </defs>
            <path d="M 0,40 C 0,0 0,0 40,0 L 340,0 C 380,0 380,0 380,40 C 380,80 380,80 340,80 L 40,80 C 0,80 0,80 0,40 Z" fill="url(#grad3)" stroke="rgba(255,255,255,0.08)" strokeWidth={1} className="notification-path glass-effect" />
          </svg>
          <div className="notification-content">
            <div className="notification-avatar user-avatar">JD</div>
            <div className="notification-body">
              <div className="notification-header">
                <div className="notification-title">John Doe</div>
                <div className="notification-time">5m</div>
              </div>
              <div className="notification-message">
                Hey! Are we still on for lunch today?
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .notification-container {
    position: relative;
    width: 380px;
    height: 120px;
    margin: 0 auto;
  }

  .notification-card {
    position: absolute;
    width: 100%;
    cursor: pointer;
    transition: all 0.3s ease-out;
    backdrop-filter: blur(20px);
    border-radius: 20px;
  }

  .notification-card:hover {
    transform: translateY(-4px);
  }

  .notification-card:active {
    transform: scale(0.98);
  }

  .notification-top {
    z-index: 30;
    top: 0;
  }

  .notification-top:hover {
    transform: translateY(-4px) scale(1.01);
  }

  .notification-middle {
    z-index: 20;
    top: 20px;
    transform: scale(0.94);
    opacity: 0.75;
  }

  .notification-middle:hover {
    transform: translateY(-4px) scale(0.96);
    opacity: 0.85;
  }

  .notification-bottom {
    z-index: 10;
    top: 40px;
    transform: scale(0.88);
    opacity: 0.5;
  }

  .notification-bottom:hover {
    transform: translateY(-4px) scale(0.9);
    opacity: 0.65;
  }

  .notification-svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 80px;
  }

  .notification-path {
    transition: all 0.3s ease;
  }

  .notification-card:hover .notification-path {
    stroke: rgba(255, 255, 255, 0.25);
  }

  .notification-content {
    position: relative;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    height: 80px;
  }

  .notification-avatar {
    width: 40px;
    height: 40px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .user-avatar {
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
  }

  .notification-body {
    flex: 1;
    min-width: 0;
  }

  .notification-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
  }

  .notification-title {
    font-size: 15px;
    font-weight: 600;
    color: #ffffff;
    line-height: 1.2;
  }

  .notification-time {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 400;
  }

  .notification-message {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .notification-meta {
    display: flex;
    align-items: center;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 2px;
  }

  .notification-meta svg {
    width: 10px;
    height: 10px;
    margin-right: 4px;
    fill: currentColor;
  }

  .status-indicators {
    position: absolute;
    bottom: 2rem;
    right: 2rem;
  }

  .status-text {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.4);
    margin-bottom: 6px;
    text-align: center;
  }

  .status-dots {
    display: flex;
    gap: 6px;
    justify-content: center;
  }

  .status-dot-large {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }

  .status-active {
    background: rgba(255, 255, 255, 0.7);
  }

  .status-inactive-1 {
    background: rgba(255, 255, 255, 0.2);
  }

  .status-inactive-2 {
    background: rgba(255, 255, 255, 0.1);
  }`;

export default Card;

- Chat/AI : 

import React from 'react';
import styled from 'styled-components';

const Button = () => {
  return (
    <StyledWrapper>
      <button className="chatBtn">
        <svg height="1.6em" fill="white" xmlSpace="preserve" viewBox="0 0 1000 1000" y="0px" x="0px" version="1.1">
          <path d="M881.1,720.5H434.7L173.3,941V720.5h-54.4C58.8,720.5,10,671.1,10,610.2v-441C10,108.4,58.8,59,118.9,59h762.2C941.2,59,990,108.4,990,169.3v441C990,671.1,941.2,720.5,881.1,720.5L881.1,720.5z M935.6,169.3c0-30.4-24.4-55.2-54.5-55.2H118.9c-30.1,0-54.5,24.7-54.5,55.2v441c0,30.4,24.4,55.1,54.5,55.1h54.4h54.4v110.3l163.3-110.2H500h381.1c30.1,0,54.5-24.7,54.5-55.1V169.3L935.6,169.3z M717.8,444.8c-30.1,0-54.4-24.7-54.4-55.1c0-30.4,24.3-55.2,54.4-55.2c30.1,0,54.5,24.7,54.5,55.2C772.2,420.2,747.8,444.8,717.8,444.8L717.8,444.8z M500,444.8c-30.1,0-54.4-24.7-54.4-55.1c0-30.4,24.3-55.2,54.4-55.2c30.1,0,54.4,24.7,54.4,55.2C554.4,420.2,530.1,444.8,500,444.8L500,444.8z M282.2,444.8c-30.1,0-54.5-24.7-54.5-55.1c0-30.4,24.4-55.2,54.5-55.2c30.1,0,54.4,24.7,54.4,55.2C336.7,420.2,312.3,444.8,282.2,444.8L282.2,444.8z" />
        </svg>
        <span className="tooltip">Chat</span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .chatBtn {
    width: 55px;
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: none;
    background-color: #FFE53B;
    background-image: linear-gradient(147deg, #FFE53B, #FF2525,#FFE53B);
    cursor: pointer;
    padding-top: 3px;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.164);
    position: relative;
    background-size: 300%;
    background-position: left;
    transition-duration: 1s;
  }

  .tooltip {
    position: absolute;
    top: -40px;
    opacity: 0;
    background-color: rgb(255, 180, 82);
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition-duration: .5s;
    pointer-events: none;
    letter-spacing: 0.5px;
  }

  .chatBtn:hover .tooltip {
    opacity: 1;
    transition-duration: .5s;
  }

  .chatBtn:hover {
    background-position: right;
    transition-duration: 1s;
  }`;

export default Button;

2) import React from 'react';
import styled from 'styled-components';

const Form = () => {
  return (
    <StyledWrapper>
      <form className="form">
        <input className="input" type="text" placeholder="Name" />
        <input className="input" type="text" placeholder="E-Mail I.D." />
        <textarea className="textarea" placeholder="Enter message" defaultValue={""} /> 
        <center><button className="button">Submit</button></center>
      </form>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .form {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    background-image: linear-gradient(45deg, #330808, 
    #3a2c09);
    border-radius: 2.5em;
    padding: 30px;
    width: 300px;
    height: 350px;
  }

  .form::before {
    content: '';
    background-image: linear-gradient(45deg, #ff0000, 
    #ffb700);
    height: 358px;
    width: 309px;
    position: absolute;
    margin-top: -34px;
    margin-left: px;
    z-index: -1;
    border-radius: 2.7em;
  }

  .button {
    margin-top: 10px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 17px;
    background: #ff5900;
    color: black;
    padding: 0.7em 5.5em;
    display: flex;
    align-items: center;
    border: 2px solid #66da4300;
    border-radius: 5em;
    overflow: hidden;
    transition: all 0.2s;
    cursor: pointer;
  }

  .button:hover {
    border: 2px solid #ff5900;
    background: #00000000;
    color: #ff5900;
  }

  .button:active {
    border: 2px solid #66da4300;
    background: #ff5900;
    color: black;
  }

  .input {
    width: calc(100% - 10px);
    padding: 8px;
    margin-bottom: 20px;
    border: 1px solid #66da4300;
    border-bottom: 1px solid #ff5900;
    outline: none;
    background-color: transparent;
    color: #ff5900;
    font-family: Arial, Helvetica, sans-serif;
    transition: 0.2s;
  }

  .input:focus {
    border: 1px solid #66da4300;
    border-bottom: 1px solid #ff5900;
    background-color: transparent;
    color: white;
  }

  .input::placeholder {
    color: #9b725b;
  }

  .textarea {
    font-family: Arial, Helvetica, sans-serif;
    width: calc(100% - 10px);
    padding: 8px;
    height: 100px;
    margin-bottom: 20px;
    border: 1px solid #66da4300;
    border-bottom: 1px solid #ff5900;
    outline: none;
    background-color: transparent;
    color: #ff5900;
  }

  .textarea::placeholder {
    color: #9b725b;
  }

  .textarea:focus {
    border: 1px solid #66da4300;
    border-bottom: 1px solid #ff5900;
    background-color: transparent;
    color: white;
  }`;

export default Form;

- Dashboard: 

1) import React from 'react';
import styled from 'styled-components';

const Card = () => {
  return (
    <StyledWrapper>
      <div className="crypto-card">
        <div className="header">
          <span className="logo">CryptoApp</span>
          <span className="open">Open App →</span>
        </div>
        <fieldset className="crypto-switch">
          <input type="radio" id="bitcoin" name="crypto" defaultChecked />
          <label htmlFor="bitcoin"> BTC </label>
          <input type="radio" id="ethereum" name="crypto" />
          <label htmlFor="ethereum"> ETH </label>
          <input type="radio" id="solana" name="crypto" />
          <label htmlFor="solana"> SOL </label>
          <input type="radio" id="tether" name="crypto" />
          <label htmlFor="tether"> TET </label>
          <div className="slider" />
        </fieldset>
        <div className="price-infos">
          <div className="price-info bitcoin" id="bitcoin-info">
            <div className="price">$57,256.15</div>
            <div className="stats">
              <span className="amount">12.458 BTC</span>
              <span className="change">+10.4%</span>
            </div>
          </div>
          <div className="price-info ethereum" id="ethereum-info">
            <div className="price">$3,452.12</div>
            <div className="stats">
              <span className="amount">34.123 ETH</span>
              <span className="change">+8.2%</span>
            </div>
          </div>
          <div className="price-info solana" id="solana-info">
            <div className="price">$145.78</div>
            <div className="stats">
              <span className="amount">150.78 SOL</span>
              <span className="change">+12.1%</span>
            </div>
          </div>
          <div className="price-info tether" id="tether-info">
            <div className="price">$1.00</div>
            <div className="stats">
              <span className="amount">10,000 TET</span>
              <span className="change">+0.0%</span>
            </div>
          </div>
        </div>
        <div className="chart">
          <svg id="chart-bitcoin" viewBox="0 0 100 50" preserveAspectRatio="none">
            <path d="M0,48 L5,45 L10,42 L15,38 L20,40 L25,35 L30,32 L35,28 L40,30 L45,25 L50,28 L55,22 L60,25 L65,20 L70,23 L75,18 L80,20 L85,15 L90,18 L95,12 L100,15, L 100 190" />
          </svg>
          <svg id="chart-ethereum" viewBox="0 0 100 40" preserveAspectRatio="none">
            <path d="M0,40 L5,38 L10,36 L15,34 L20,32 L25,30 L30,28 L35,26 L40,24 L45,22 L50,20 L55,22 L60,18 L65,20 L70,15 L75,18 L80,14 L85,16 L90,12 L95,14 L100,10, L 100 190" />
          </svg>
          <svg id="chart-solana" viewBox="0 0 100 38" preserveAspectRatio="none">
            <path d="M0,35 L5,33 L10,31 L15,29 L20,27 L25,25 L30,23 L35,21 L40,19 L45,18 L50,16 L55,15 L60,14 L65,12 L70,11 L75,10 L80,9 L85,8 L90,7 L95,6 L100,5, L 100 190" />
          </svg>
          <svg id="chart-tether" viewBox="0 0 100 50" preserveAspectRatio="none" fill="none">
            <path d="M0,25 L5,25 L10,25 L15,25 L20,25 L25,25 L30,25 L35,25 L40,25 L45,25 L50,25 L55,25 L60,25 L65,25 L70,25 L75,25 L80,25 L85,25 L90,25 L95,25 L100,25," />
          </svg>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .crypto-card {
    max-width: 360px;
    width: 90%;
    padding: 20px;
    border-radius: 35px;
    background: #000;
    color: #fff;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .logo {
    font-weight: bold;
    font-size: 1.2em;
  }
  .open {
    font-size: 0.85em;
    color: #888;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .open:hover {
    color: #fff;
  }

  .crypto-switch {
    position: relative;
    display: flex;
    background: #222;
    border-radius: 20px;
    padding: 4px;
    gap: 8px;
    margin-bottom: 16px;
    user-select: none;
  }
  .crypto-switch input {
    display: none;
  }
  .crypto-switch label {
    flex: 1;
    text-align: center;
    padding: 8px 0;
    border-radius: 16px;
    cursor: pointer;
    color: #cccccc;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: color 0.3s;
    font-size: 0.9em;
  }
  .crypto-switch input:checked + label {
    color: #ffffff;
  }

  .crypto-switch .slider {
    position: absolute;
    top: 4px;
    bottom: 4px;
    width: calc((100% - 24px) / 4);
    background: rgba(255, 255, 255, 0.4);
    -webkit-backdrop-filter: blur(1px);
    backdrop-filter: blur(0.5px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    z-index: 1;
    transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    box-shadow:
      0 4px 8px rgba(0, 0, 0, 0.4),
      inset 0 -2px 4px rgba(255, 255, 255, 0.2);
  }
  .crypto-switch input:hover + label {
    color: #ffffff;
  }
  #bitcoin:checked ~ .slider {
    transform: translateX(0%);
  }
  #ethereum:checked ~ .slider {
    transform: translateX(105%);
  }
  #solana:checked ~ .slider {
    transform: translateX(214%);
  }
  #tether:checked ~ .slider {
    transform: translateX(323%);
  }

  .price-infos {
    margin-bottom: 16px;
  }
  .price-info .price {
    font-size: 1.6em;
    font-weight: bold;
    margin-bottom: 4px;
  }
  .price-info .stats {
    display: flex;
    justify-content: space-between;
    font-size: 0.9em;
  }
  .price-info .change {
    color: #0f0;
    font-weight: bold;
  }

  .chart {
    height: 90px;
    background: #1b1b1b;
    border-radius: 12px;
    position: relative;
    overflow: hidden;
    width: 100%;
  }
  .chart svg {
    width: 100%;
    height: 100%;
    display: none;
    transform: translateX(2px) scale(1.05);
  }
  .chart path {
    stroke: #0f0;
    stroke-width: 0.7;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 500;
    stroke-dashoffset: 500;
    animation: draw 3s forwards;
    fill: rgba(0, 255, 0, 0.2);
  }
  @keyframes draw {
    to {
      stroke-dashoffset: 0;
    }
  }

  .crypto-card:has(#bitcoin:checked) .chart #chart-bitcoin,
  .crypto-card:has(#ethereum:checked) .chart #chart-ethereum,
  .crypto-card:has(#solana:checked) .chart #chart-solana,
  .crypto-card:has(#tether:checked) .chart #chart-tether {
    display: block;
  }

  .price-info {
    display: none;
  }
  .crypto-card:has(#bitcoin:checked) .price-info.bitcoin,
  .crypto-card:has(#ethereum:checked) .price-info.ethereum,
  .crypto-card:has(#solana:checked) .price-info.solana,
  .crypto-card:has(#tether:checked) .price-info.tether {
    display: block;
  }`;

export default Card;

2) import React from 'react';

const Card = () => {
  return (
    <div className="group relative flex w-80 flex-col rounded-xl bg-slate-950 p-4 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/20">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-sm transition-opacity duration-300 group-hover:opacity-30" />
      <div className="absolute inset-px rounded-[11px] bg-slate-950" />
      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-white">Performance Analytics</h3>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Live
          </span>
        </div>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-slate-900/50 p-3">
            <p className="text-xs font-medium text-slate-400">Total Views</p>
            <p className="text-lg font-semibold text-white">24.5K</p>
            <span className="text-xs font-medium text-emerald-500">+12.3%</span>
          </div>
          <div className="rounded-lg bg-slate-900/50 p-3">
            <p className="text-xs font-medium text-slate-400">Conversions</p>
            <p className="text-lg font-semibold text-white">1.2K</p>
            <span className="text-xs font-medium text-emerald-500">+8.1%</span>
          </div>
        </div>
        <div className="mb-4 h-24 w-full overflow-hidden rounded-lg bg-slate-900/50 p-3">
          <div className="flex h-full w-full items-end justify-between gap-1">
            <div className="h-[40%] w-3 rounded-sm bg-indigo-500/30">
              <div className="h-[60%] w-full rounded-sm bg-indigo-500 transition-all duration-300" />
            </div>
            <div className="h-[60%] w-3 rounded-sm bg-indigo-500/30">
              <div className="h-[40%] w-full rounded-sm bg-indigo-500 transition-all duration-300" />
            </div>
            <div className="h-[75%] w-3 rounded-sm bg-indigo-500/30">
              <div className="h-[80%] w-full rounded-sm bg-indigo-500 transition-all duration-300" />
            </div>
            <div className="h-[45%] w-3 rounded-sm bg-indigo-500/30">
              <div className="h-[50%] w-full rounded-sm bg-indigo-500 transition-all duration-300" />
            </div>
            <div className="h-[85%] w-3 rounded-sm bg-indigo-500/30">
              <div className="h-[90%] w-full rounded-sm bg-indigo-500 transition-all duration-300" />
            </div>
            <div className="h-[65%] w-3 rounded-sm bg-indigo-500/30">
              <div className="h-[70%] w-full rounded-sm bg-indigo-500 transition-all duration-300" />
            </div>
            <div className="h-[95%] w-3 rounded-sm bg-indigo-500/30">
              <div className="h-[85%] w-full rounded-sm bg-indigo-500 transition-all duration-300" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Last 7 days</span>
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <button className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1 text-xs font-medium text-white transition-all duration-300 hover:from-indigo-600 hover:to-purple-600">
            View Details
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;

3) import React from 'react';
import styled from 'styled-components';

const Form = () => {
  return (
    <StyledWrapper>
      <form className="form">
        <div className="flex-column">
          <label>Email </label></div>
        <div className="inputForm">
          <svg xmlns="http://www.w3.org/2000/svg" width={20} viewBox="0 0 32 32" height={20}><g data-name="Layer 3" id="Layer_3"><path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" /></g></svg>
          <input placeholder="Enter your Email" className="input" type="text" />
        </div>
        <div className="flex-column">
          <label>Password </label></div>
        <div className="inputForm">
          <svg xmlns="http://www.w3.org/2000/svg" width={20} viewBox="-64 0 512 512" height={20}><path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" /><path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" /></svg>        
          <input placeholder="Enter your Password" className="input" type="password" />
        </div>
        <div className="flex-row">
          <div>
            <input type="radio" />
            <label>Remember me </label>
          </div>
          <span className="span">Forgot password?</span>
        </div>
        <button className="button-submit">Sign In</button>
        <p className="p">Don't have an account? <span className="span">Sign Up</span>
        </p><p className="p line">Or With</p>
        <div className="flex-row">
          <button className="btn google">
            <svg xmlSpace="preserve" style={{enableBackground: 'new 0 0 512 512'}} viewBox="0 0 512 512" y="0px" x="0px" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" id="Layer_1" width={20} version="1.1">
              <path d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256
      	c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456
      	C103.821,274.792,107.225,292.797,113.47,309.408z" style={{fill: '#FBBB00'}} />
              <path d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451
      	c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535
      	c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z" style={{fill: '#518EF8'}} />
              <path d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512
      	c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771
      	c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z" style={{fill: '#28B446'}} />
              <path d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012
      	c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0
      	C318.115,0,375.068,22.126,419.404,58.936z" style={{fill: '#F14336'}} />
            </svg>
            Google 
          </button><button className="btn apple">
            <svg xmlSpace="preserve" style={{enableBackground: 'new 0 0 22.773 22.773'}} viewBox="0 0 22.773 22.773" y="0px" x="0px" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" id="Capa_1" width={20} height={20} version="1.1"> <g> <g> <path d="M15.769,0c0.053,0,0.106,0,0.162,0c0.13,1.606-0.483,2.806-1.228,3.675c-0.731,0.863-1.732,1.7-3.351,1.573 c-0.108-1.583,0.506-2.694,1.25-3.561C13.292,0.879,14.557,0.16,15.769,0z" /> <path d="M20.67,16.716c0,0.016,0,0.03,0,0.045c-0.455,1.378-1.104,2.559-1.896,3.655c-0.723,0.995-1.609,2.334-3.191,2.334 c-1.367,0-2.275-0.879-3.676-0.903c-1.482-0.024-2.297,0.735-3.652,0.926c-0.155,0-0.31,0-0.462,0 c-0.995-0.144-1.798-0.932-2.383-1.642c-1.725-2.098-3.058-4.808-3.306-8.276c0-0.34,0-0.679,0-1.019 c0.105-2.482,1.311-4.5,2.914-5.478c0.846-0.52,2.009-0.963,3.304-0.765c0.555,0.086,1.122,0.276,1.619,0.464 c0.471,0.181,1.06,0.502,1.618,0.485c0.378-0.011,0.754-0.208,1.135-0.347c1.116-0.403,2.21-0.865,3.652-0.648 c1.733,0.262,2.963,1.032,3.723,2.22c-1.466,0.933-2.625,2.339-2.427,4.74C17.818,14.688,19.086,15.964,20.67,16.716z" /> </g></g></svg>
            Apple 
          </button></div></form>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #ffffff;
    padding: 30px;
    width: 450px;
    border-radius: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  ::placeholder {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  .form button {
    align-self: flex-end;
  }

  .flex-column > label {
    color: #151717;
    font-weight: 600;
  }

  .inputForm {
    border: 1.5px solid #ecedec;
    border-radius: 10px;
    height: 50px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    transition: 0.2s ease-in-out;
  }

  .input {
    margin-left: 10px;
    border-radius: 10px;
    border: none;
    width: 100%;
    height: 100%;
  }

  .input:focus {
    outline: none;
  }

  .inputForm:focus-within {
    border: 1.5px solid #2d79f3;
  }

  .flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
  }

  .flex-row > div > label {
    font-size: 14px;
    color: black;
    font-weight: 400;
  }

  .span {
    font-size: 14px;
    margin-left: 5px;
    color: #2d79f3;
    font-weight: 500;
    cursor: pointer;
  }

  .button-submit {
    margin: 20px 0 10px 0;
    background-color: #151717;
    border: none;
    color: white;
    font-size: 15px;
    font-weight: 500;
    border-radius: 10px;
    height: 50px;
    width: 100%;
    cursor: pointer;
  }

  .p {
    text-align: center;
    color: black;
    font-size: 14px;
    margin: 5px 0;
  }

  .btn {
    margin-top: 10px;
    width: 100%;
    height: 50px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    gap: 10px;
    border: 1px solid #ededef;
    background-color: white;
    cursor: pointer;
    transition: 0.2s ease-in-out;
  }

  .btn:hover {
    border: 1px solid #2d79f3;
    ;
  }`;

export default Form;

4) import React from 'react';
import styled from 'styled-components';

const Form = () => {
  return (
    <StyledWrapper>
      <div className="container">
        <div className="heading">Sign In</div>
        <form action className="form">
          <input required className="input" type="email" name="email" id="email" placeholder="E-mail" />
          <input required className="input" type="password" name="password" id="password" placeholder="Password" />
          <span className="forgot-password"><a href="#">Forgot Password ?</a></span>
          <input className="login-button" type="submit" defaultValue="Sign In" />
        </form>
        <div className="social-account-container">
          <span className="title">Or Sign in with</span>
          <div className="social-accounts">
            <button className="social-button google">
              <svg className="svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 488 512">
                <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
              </svg></button>
            <button className="social-button apple">
              <svg className="svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
              </svg>
            </button>
            <button className="social-button twitter">
              <svg className="svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
              </svg>
            </button>
          </div>
        </div>
        <span className="agreement"><a href="#">Learn user licence agreement</a></span>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .container {
    max-width: 350px;
    background: #F8F9FD;
    background: linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(244, 247, 251) 100%);
    border-radius: 40px;
    padding: 25px 35px;
    border: 5px solid rgb(255, 255, 255);
    box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 30px 30px -20px;
    margin: 20px;
  }

  .heading {
    text-align: center;
    font-weight: 900;
    font-size: 30px;
    color: rgb(16, 137, 211);
  }

  .form {
    margin-top: 20px;
  }

  .form .input {
    width: 100%;
    background: white;
    border: none;
    padding: 15px 20px;
    border-radius: 20px;
    margin-top: 15px;
    box-shadow: #cff0ff 0px 10px 10px -5px;
    border-inline: 2px solid transparent;
  }

  .form .input::-moz-placeholder {
    color: rgb(170, 170, 170);
  }

  .form .input::placeholder {
    color: rgb(170, 170, 170);
  }

  .form .input:focus {
    outline: none;
    border-inline: 2px solid #12B1D1;
  }

  .form .forgot-password {
    display: block;
    margin-top: 10px;
    margin-left: 10px;
  }

  .form .forgot-password a {
    font-size: 11px;
    color: #0099ff;
    text-decoration: none;
  }

  .form .login-button {
    display: block;
    width: 100%;
    font-weight: bold;
    background: linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%);
    color: white;
    padding-block: 15px;
    margin: 20px auto;
    border-radius: 20px;
    box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 20px 10px -15px;
    border: none;
    transition: all 0.2s ease-in-out;
  }

  .form .login-button:hover {
    transform: scale(1.03);
    box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 23px 10px -20px;
  }

  .form .login-button:active {
    transform: scale(0.95);
    box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 15px 10px -10px;
  }

  .social-account-container {
    margin-top: 25px;
  }

  .social-account-container .title {
    display: block;
    text-align: center;
    font-size: 10px;
    color: rgb(170, 170, 170);
  }

  .social-account-container .social-accounts {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 5px;
  }

  .social-account-container .social-accounts .social-button {
    background: linear-gradient(45deg, rgb(0, 0, 0) 0%, rgb(112, 112, 112) 100%);
    border: 5px solid white;
    padding: 5px;
    border-radius: 50%;
    width: 40px;
    aspect-ratio: 1;
    display: grid;
    place-content: center;
    box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 12px 10px -8px;
    transition: all 0.2s ease-in-out;
  }

  .social-account-container .social-accounts .social-button .svg {
    fill: white;
    margin: auto;
  }

  .social-account-container .social-accounts .social-button:hover {
    transform: scale(1.2);
  }

  .social-account-container .social-accounts .social-button:active {
    transform: scale(0.9);
  }

  .agreement {
    display: block;
    text-align: center;
    margin-top: 15px;
  }

  .agreement a {
    text-decoration: none;
    color: #0099ff;
    font-size: 9px;
  }`;

export default Form;

- Card paywall: import React from 'react';
import styled from 'styled-components';

const Card = () => {
  return (
    <StyledWrapper>
      <div className="card-container">
        <div className="title-card">
          <p>MOST POPULAR</p>
          <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24">
            <path fill="currentColor" d="M10.277 16.515c.005-.11.187-.154.24-.058c.254.45.686 1.111 1.177 1.412c.49.3 1.275.386 1.791.408c.11.005.154.186.058.24c-.45.254-1.111.686-1.412 1.176s-.386 1.276-.408 1.792c-.005.11-.187.153-.24.057c-.254-.45-.686-1.11-1.176-1.411s-1.276-.386-1.792-.408c-.11-.005-.153-.187-.057-.24c.45-.254 1.11-.686 1.411-1.177c.301-.49.386-1.276.408-1.791m8.215-1c-.008-.11-.2-.156-.257-.062c-.172.283-.421.623-.697.793s-.693.236-1.023.262c-.11.008-.155.2-.062.257c.283.172.624.42.793.697s.237.693.262 1.023c.009.11.2.155.258.061c.172-.282.42-.623.697-.792s.692-.237 1.022-.262c.11-.009.156-.2.062-.258c-.283-.172-.624-.42-.793-.697s-.236-.692-.262-1.022M14.704 4.002l-.242-.306c-.937-1.183-1.405-1.775-1.95-1.688c-.545.088-.806.796-1.327 2.213l-.134.366c-.149.403-.223.604-.364.752c-.143.148-.336.225-.724.38l-.353.141l-.248.1c-1.2.48-1.804.753-1.881 1.283c-.082.565.49 1.049 1.634 2.016l.296.25c.325.275.488.413.58.6c.094.187.107.403.134.835l.024.393c.093 1.52.14 2.28.634 2.542s1.108-.147 2.336-.966l.318-.212c.35-.233.524-.35.723-.381c.2-.032.402.024.806.136l.368.102c1.422.394 2.133.591 2.52.188c.388-.403.196-1.14-.19-2.613l-.099-.381c-.11-.419-.164-.628-.134-.835s.142-.389.365-.752l.203-.33c.786-1.276 1.179-1.914.924-2.426c-.254-.51-.987-.557-2.454-.648l-.379-.024c-.417-.026-.625-.039-.806-.135c-.18-.096-.314-.264-.58-.6m-5.869 9.324C6.698 14.37 4.919 16.024 4.248 18c-.752-4.707.292-7.747 1.965-9.637c.144.295.332.539.5.73c.35.396.852.82 1.362 1.251l.367.31l.17.145c.005.064.01.14.015.237l.03.485c.04.655.08 1.294.178 1.805" />
          </svg>
        </div>
        <div className="card-content">
          <p className="title">Profesional</p>
          <p className="plain">
            <span>$98,00</span>
            <span>/ month</span>
          </p>
          <p className="description">Best for growing startups and growth companies</p>
          <button className="card-btn">Sign Up with Pro</button>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card-container {
    width: 260px;
    background: linear-gradient(
      to top right,
      #975af4,
      #2f7cf8 40%,
      #78aafa 65%,
      #934cff 100%
    );
    padding: 4px;
    border-radius: 32px;
    display: flex;
    flex-direction: column;
  }
  .card-container .title-card {
    display: flex;
    align-items: center;
    padding: 16px 18px;
    justify-content: space-between;
    color: #fff;
  }
  .card-container .title-card p {
    font-size: 14px;
    font-weight: 600;
    font-style: italic;
    text-shadow: 2px 2px 6px #2975ee;
  }

  .card-container .card-content {
    width: 100%;
    height: 100%;
    background-color: #161a20;
    border-radius: 30px;
    color: #838383;
    font-size: 12px;
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .card-container .card-content .title {
    font-weight: 600;
    color: #bab9b9;
  }
  .card-container .card-content .plain :nth-child(1) {
    font-size: 36px;
    color: #fff;
  }
  .card-container .card-content .card-btn {
    background: linear-gradient(
      4deg,
      #975af4,
      #2f7cf8 40%,
      #78aafa 65%,
      #934cff 100%
    );
    padding: 8px;
    border: none;
    width: 100%;
    border-radius: 8px;
    color: white;
    font-size: 12px;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.6);
  }
  .card-container .card-content .card-btn:hover {
    color: #ffffff;
    text-shadow: 0 0 8px #fff;
    transform: scale(1.03);
  }
  .card-container .card-content .card-btn:active {
    transform: scale(1);
  }`;

export default Card;

2) import React from 'react';
import styled from 'styled-components';

const Form = () => {
  return (
    <StyledWrapper>
      <section className="add-card page">
        <form className="form">
          <label htmlFor="name" className="label">
            <span className="title">Card holder full name</span>
            <input className="input-field" type="text" name="input-name" title="Input title" placeholder="Enter your full name" />
          </label>
          <label htmlFor="serialCardNumber" className="label">
            <span className="title">Card Number</span>
            <input id="serialCardNumber" className="input-field" type="number" name="input-name" title="Input title" placeholder="0000 0000 0000 0000" />
          </label>
          <div className="split">
            <label htmlFor="ExDate" className="label">
              <span className="title">Expiry Date</span>
              <input id="ExDate" className="input-field" type="text" name="input-name" title="Expiry Date" placeholder="01/23" />
            </label>
            <label htmlFor="cvv" className="label">
              <span className="title"> CVV</span>
              <input id="cvv" className="input-field" type="number" name="cvv" title="CVV" placeholder="CVV" />
            </label>
          </div>
          <input className="checkout-btn" type="button" defaultValue="Checkout" />
        </form>
      </section>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .form {
    background: #0c0f14;
    box-shadow: 0px 187px 75px rgba(0, 0, 0, 0.01),
      0px 105px 63px rgba(0, 0, 0, 0.05), 0px 47px 47px rgba(0, 0, 0, 0.09),
      0px 12px 26px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1);
    width: 320px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 20px;
    position: relative;
    border-radius: 25px;
  }
  .form .label {
    display: flex;
    flex-direction: column;
    gap: 5px;
    height: -moz-fit-content;
    height: fit-content;
  }
  .form .label:has(input:focus) .title {
    top: 0;
    left: 0;
    color: #d17842;
  }
  .form .label .title {
    padding: 0 10px;
    transition: all 300ms;
    font-size: 12px;
    color: #8b8e98;
    font-weight: 600;
    width: -moz-fit-content;
    width: fit-content;
    top: 14px;
    position: relative;
    left: 15px;
    background: #0c0f14;
  }
  .form .input-field {
    width: auto;
    height: 50px;
    text-indent: 15px;
    border-radius: 15px;
    outline: none;
    background-color: transparent;
    border: 1px solid #21262e;
    transition: all 0.3s;
    caret-color: #d17842;
    color: #aeaeae;
  }

  .form .input-field:hover {
    border-color: rgba(209, 121, 66, 0.5);
  }

  .form .input-field:focus {
    border-color: #d17842;
  }
  .form .split {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    gap: 15px;
  }
  .form .split label {
    width: 130px;
  }
  .form .checkout-btn {
    margin-top: 20px;
    padding: 20px 0;
    border-radius: 25px;
    font-weight: 700;
    transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
    cursor: pointer;
    font-size: 20px;
    font-weight: 500;
    display: flex;
    align-items: center;
    border: none;
    justify-content: center;
    fill: #fff;
    color: #fff;
    border: 2px solid transparent;
    background: #d17842;
    transition: all 200ms;
  }
  .form .checkout-btn:active {
    scale: 0.95;
  }

  .form .checkout-btn:hover {
    color: #d17842;
    border: 2px solid #d17842;
    background: transparent;
  }`;

export default Form;