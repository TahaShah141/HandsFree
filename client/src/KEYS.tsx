import { KeyType } from "./types";
import cmd from './assets/command.svg'
import opt from './assets/option.svg'
import ctrl from './assets/control.svg'
import fn from './assets/globe.svg'
import f1 from './assets/f1.svg';
import f2 from './assets/f2.svg';
import f3 from './assets/f3.svg';
import f4 from './assets/f4.svg';
import f5 from './assets/f5.svg';
import f6 from './assets/f6.svg';
import f7 from './assets/f7.svg';
import f8 from './assets/f8.svg';
import f9 from './assets/f9.svg';
import f10 from './assets/f10.svg';
import f11 from './assets/f11.svg';
import f12 from './assets/f12.svg';

const Icon: React.FC<{svg: string}> = ({svg}) => {
  return <img className={`size-3`} src={svg}></img>
}

const functionKeys = [
  {
    width: 1,
    display: (
      <div className="size-full flex text-[8px] flex-col justify-center gap-1 items-center">
        <Icon svg={f1} />
        <p className="uppercase">{`f1`}</p>
      </div>
    ),
    keyCode: "f1",
  },
  {
    width: 1,
    display: (
      <div className="size-full flex text-[8px] flex-col justify-center gap-1 items-center">
        <Icon svg={f2} />
        <p className="uppercase">{`f2`}</p>
      </div>
    ),
    keyCode: "f2",
  },
  {
    width: 1,
    display: (
      <div className="size-full flex text-[8px] flex-col justify-center gap-1 items-center">
        <Icon svg={f3} />
        <p className="uppercase">{`f3`}</p>
      </div>
    ),
    keyCode: "f3",
  },
  {
    width: 1,
    display: (
      <div className="size-full flex text-[8px] flex-col justify-center gap-1 items-center">
        <Icon svg={f4} />
        <p className="uppercase">{`f4`}</p>
      </div>
    ),
    keyCode: "f4",
  },
  {
    width: 1,
    display: (
      <div className="size-full flex text-[8px] flex-col justify-center gap-1 items-center">
        <Icon svg={f5} />
        <p className="uppercase">{`f5`}</p>
      </div>
    ),
    keyCode: "f5",
  },
  {
    width: 1,
    display: (
      <div className="size-full flex text-[8px] flex-col justify-center gap-1 items-center">
        <Icon svg={f6} />
        <p className="uppercase">{`f6`}</p>
      </div>
    ),
    keyCode: "f6",
  },
  {
    width: 1,
    display: (
      <div className="size-full flex text-[8px] flex-col justify-center gap-1 items-center">
        <Icon svg={f7} />
        <p className="uppercase">{`f7`}</p>
      </div>
    ),
    keyCode: "f7",
  },
  {
    width: 1,
    display: (
      <div className="size-full flex text-[8px] flex-col justify-center gap-1 items-center">
        <Icon svg={f8} />
        <p className="uppercase">{`f8`}</p>
      </div>
    ),
    keyCode: "f8",
  },
  {
    width: 1,
    display: (
      <div className="size-full flex text-[8px] flex-col justify-center gap-1 items-center">
        <Icon svg={f9} />
        <p className="uppercase">{`f9`}</p>
      </div>
    ),
    keyCode: "f9",
  },
  {
    width: 1,
    display: (
      <div className="size-full flex text-[8px] flex-col justify-center gap-1 items-center">
        <Icon svg={f10} />
        <p className="uppercase">{`f10`}</p>
      </div>
    ),
    keyCode: "f10",
  },
  {
    width: 1,
    display: (
      <div className="size-full flex text-[8px] flex-col justify-center gap-1 items-center">
        <Icon svg={f11} />
        <p className="uppercase">{`f11`}</p>
      </div>
    ),
    keyCode: "f11",
  },
  {
    width: 1,
    display: (
      <div className="size-full flex text-[8px] flex-col justify-center gap-1 items-center">
        <Icon svg={f12} />
        <p className="uppercase">{`f12`}</p>
      </div>
    ),
    keyCode: "f12",
  },
];

const stackedKey = (symbols: string[]): KeyType => {
  return ({
    keyCode: symbols[1],
    width: 1,
    display: <div className="size-full flex flex-col-reverse justify-center items-center">{symbols.reverse().map(s => <p>{s}</p>)}</div>
  })
}

const alphabetKey = (alpha: string): KeyType => {
  return ({
    keyCode: alpha,
    width: 1,
    display: <div className="size-full text-sm flex flex-col justify-center items-center">{alpha.toUpperCase()}</div>
  })
}

export const KEYS: KeyType[][] = [
  [
    {
      width: 1.5,
      display: <div className="size-full flex flex-col justify-end">esc</div>,
      keyCode: "escape",
    },
    ...functionKeys,
    {
      width: 1,
      display: <div className="rounded-full flex flex-col items-center justify-center size-8 border border-neutral-950 bg-neutral-900"></div>,
      keyCode: 'lock',
    },
  ],
  [
    stackedKey(['~', '`']),
    stackedKey(['!', '1']),
    stackedKey(['@', '2']),
    stackedKey(['#', '3']),
    stackedKey(['$', '4']),
    stackedKey(['%', '5']),
    stackedKey(['^', '6']),
    stackedKey(['&', '7']),
    stackedKey(['*', '8']),
    stackedKey(['(', '9']),
    stackedKey([')', '0']),
    stackedKey(['_', '-']),
    stackedKey(['+', '=']),
    {
      width: 1.5,
      display: <div className="size-full flex flex-col justify-end items-end">delete</div>,
      keyCode: "backspace",
    },
  ],
  [
    {
      width: 1.5,
      display: <div className="size-full flex flex-col justify-end">tab</div>,
      keyCode: "tab",
    },
    ...('qwertyuiop'.split("")).map((alpha) => alphabetKey(alpha)),
    stackedKey(['{', '[']),
    stackedKey(['}', ']']),
    stackedKey(['|', '\\']),
  ],
  [
    {
      width: 1.75,
      display: <div className="size-full flex flex-col justify-end">caps lock</div>,
      keyCode: "hyper",
    },
    ...('asdfghjkl'.split("")).map((alpha) => alphabetKey(alpha)),
    stackedKey([':', ';']),
    stackedKey(['"', "'"]),
    {
      width: 1.8,
      display: <div className="size-full flex flex-col justify-end items-end">return</div>,
      keyCode: "enter",
    },
  ],
  [
    {
      width: 2.325,
      display: <div className="size-full flex flex-col justify-end">shift</div>,
      keyCode: "shift",
    },
    ...('zxcvbnm'.split("")).map((alpha) => alphabetKey(alpha)),
    stackedKey(['<', ',']),
    stackedKey(['>', '.']),
    stackedKey(['?', '/']),
    {
      width: 2.325,
      display: <div className="size-full flex flex-col justify-end items-end">shift</div>,
      keyCode: "shift",
    },
  ],
  [
    {
      width: 1,
      display: <div className="size-full text-[10px] flex flex-col pb-1 justify-between"><p className="text-end">fn</p><Icon svg={fn}/></div>,
      keyCode: 'fn',
    },
    {
      width: 1,
      display: <div className="size-full text-[10px] flex flex-col justify-between items-end"><Icon svg={ctrl}/><p>control</p></div>,
      keyCode: 'ctrl',
    },
    {
      width: 1,
      display: <div className="size-full text-[10px] flex flex-col justify-between items-end"><Icon svg={opt}/><p>option</p></div>,
      keyCode: 'alt',
    },
    {
      width: 1.25,
      display: <div className="size-full text-[10px] flex flex-col justify-between items-end"><Icon svg={cmd}/><p>command</p></div>,
      keyCode: 'cmd',
    },
    {
      width: 5.3,
      keyCode: "space",
    },
    {
      width: 1.25,
      display: <div className="size-full text-[10px] flex flex-col justify-between"><Icon svg={cmd}/><p>command</p></div>,
      keyCode: 'cmd',
    },
    {
      width: 1,
      display: <div className="size-full text-[10px] flex flex-col justify-between"><Icon svg={opt}/><p>option</p></div>,
      keyCode: 'alt',
    },
  ]
]