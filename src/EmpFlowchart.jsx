/** @jsxImportSource @emotion/react */
import React from 'react';
import { Global, keyframes } from '@emotion/react';

/* ====== 0) СЦЕНА (повний екран) ====== */
const PAD_X = 'clamp(24px, 5vw, 120px)'; // горизонтальні поля залишили
const stage = {
  position: 'fixed',
  inset: 0,
  padding: `0 ${PAD_X}`,      // верх/низ = 0, щоб не було «повітря»
  boxSizing: 'border-box',
  overflow: 'hidden',
};

/* ====== 0.1) Хук для динамічних змінних (responsive) ====== */
const BASE_W = 1800;
const BASE_H = 900;

function useResponsiveVars(ref) {
  const [vars, setVars] = React.useState({});

  React.useLayoutEffect(() => {
    const recalc = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const sx = r.width / BASE_W;         // масштаб по ширині
      const sy = r.height / BASE_H;        // масштаб по висоті
      const s  = Math.min(sx, sy);         // орієнтир для товщин

      // Цільові «екранні» розміри (можна підкрутити формули під смак)
      const lineW  = Math.min(8, 3 + 3 * s);         // товщина пунктиру
      const dotSz  = Math.min(18, 10 + 6 * s);       // діаметр червоних точок
      const dotBw  = Math.max(2, lineW * 0.66);      // товщина рамки точки
      const arrowW = Math.min(24, 28 + 24 * s);      // ширина іконок-стрілок
      const cr     = Math.min(20, 10 + 6 * s);       // радіус кутів

      setVars({
        '--lw': `${lineW}px`,
        '--lw-half': `${lineW / 2}px`,
        '--dot': `${dotSz}px`,
        '--dotbw': `${dotBw}px`,
        '--arroww': `${arrowW}px`,
        '--cr-dyn': `${cr}px`,
      });
    };
    recalc();
    window.addEventListener('resize', recalc);
    const ro = new ResizeObserver(recalc);
    if (ref.current) ro.observe(ref.current);
    return () => {
      window.removeEventListener('resize', recalc);
      ro.disconnect();
    };
  }, [ref]);

  return vars;
}

/* ====== 1) КОНСТАНТИ/АНІМАЦІЇ ====== */
const COLOR_BG = 'white';
const COLOR_LINE = '#70808f';
const SPEED = '4s';
const CORNER_R = '12px';
const PAR_GAP = '2.15%';
const PAR_LEN = '45%';
const LINE_W = 3; // базове (перекривається var(--lw))

const moveDotStraight = keyframes({ '0%': { top: '10%' }, '25%': { top: '65%' }, '100%': { top: '65%' } });
const moveDotStraightDeep = keyframes({ '0%': { top: '30%', left: '54%' }, '50%': { top: '82%', left: '54%' }, '100%': { top: '82%', left: '54%' } });
const moveDotStraightDeeper = keyframes({ '0%': { top: '10%', left: '52.3%' }, '60%': { top: '82%', left: '52.3' }, '100%': { top: '82%', left: '52.3%' } });
const moveDotCorner = keyframes({
  '0%':   { top: '40%', left: 'calc(30% - var(--lw-half))' },
  '45%':  { top: '88%', left: 'calc(30% - var(--lw-half))' },
  '100%': { top: '88%', left: 'calc(100% - var(--lw-half))' },
});
const moveDotCornerLeft = keyframes({ '0%': { top: '40%', left: '30%' }, '45%': { top: '88%', left: '30%' }, '100%': { top: '88%', left: '100%' } });
const moveDotCornerRight = keyframes({ '0%': { top: '40%', left: '30%' }, '45%': { top: '88%', left: '30%' }, '100%': { top: '88%', left: '100%' } });
const moveDotBLZig = keyframes({
  '0%': { top: '38.4%', left: 'calc(5% + 19%)' },
  '30%': { top: '38.4%', left: 'calc(55% + var(--lw-half))' },
  '70%': { top: '88%', left: 'calc(55% + var(--lw-half))' },
  '100%': { top: '88%', left: '80%' },
});
const moveDotBRZig = keyframes({
  '0%': { top: '38.3%', left: 'calc(5% + 19%)' },
  '30%': { top: '38.3%', left: '55%' },
  '70%': { top: '88%', left: '55%' },
  '100%': { top: '88%', left: '80%' },
});
const moveDotTLZig = keyframes({
  '0%': { top: '39.4%', left: 'calc(5% + 19%)' },
  '30%': { top: '39.4%', left: '55.1%' },
  '70%': { top: '88.8%', left: '55.1%' },
  '100%': { top: '88.8%', left: '80%' },
});

/* ====== 2) СТИЛІ (усе в % + CSS-змінні) ====== */
const wrapper = {
  position: 'absolute',
  inset: 0,
  '--top-shift': '-11vmin',
  transform: 'translateY(var(--top-shift))',

  // дефолтні значення, поки не порахує хук
  '--lw': `${LINE_W}px`,
  '--lw-half': `calc(var(--lw) / 2)`,
  '& > .item': {
    position: 'absolute',
    top: 0,
    left: '50%',
    height: '50%',
    width: '50%',
    transform: 'translateX(-50%)',
    transformOrigin: '50% 100%',
    pointerEvents: 'none',
    zIndex: 1,
    overflow: 'visible',
  },

  '& > .item.-v-down': { transform: 'translateX(-50%) rotate(180deg)' },

  '& > .item > .line': {
    height: '60%',
    width: '52%',
    borderRight: `var(--lw) dashed ${COLOR_LINE}`,
  },

  '& > .item > .dot': { position: 'absolute', inset: 0 },
  '& > .item > .dot::after': {
    content: "''",
    position: 'absolute',
    left: 'calc(53% + var(--lw-half))',
    top: '10%',
    transform: 'translate(-50%, -50%)',
    height: '0.6%',
    width: '0.4%',
    background: '#fc4d57',
    border: `var(--dotbw) solid #fc4d57`,
    borderRadius: '8px',
    animation: `${moveDotStraight} ${SPEED} linear infinite`,
  },

  '& > .item.-bottom-main > .dot::after': { animation: `${moveDotStraightDeep} ${SPEED} linear infinite` },

  '& > .item.-v-down > .circle > img': { transform: 'rotate(180deg)', width: '29%','@media (max-width: 500px)': {
     width:'80%'
    }  },

  '& > .item.-parallel': { left: `calc(50% + ${PAR_GAP})`, height: PAR_LEN, zIndex: 0 },

  '& > .item.-parallel > .line': { position: 'absolute', top: '20%', left: '0%' },

  '& > .item.-parallel > .dot::after': {
    animation: `${moveDotStraightDeeper} ${SPEED} linear infinite`,
    animationDirection: 'reverse',
  },

  /* картки */
  '& > .item > .circle, & > .item.-type2 > .circle': {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: COLOR_BG,
    overflow: 'hidden',
    boxShadow: '0 0 24px rgba(0,0,0,.12)',
    pointerEvents: 'auto',
    width: 'var(--thumb-w, 50%)',
    height: 'var(--thumb-h, 20%)',
    boxSizing: 'border-box',
    padding: 'var(--pad-y, 0) var(--pad-x, 0)',
    zIndex: 2,
  },
  '& > .item > .circle > img, & > .item.-type2 > .circle > img': {
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    objectPosition: 'center',
  },

  /* L-блоки (база) */
  '& > .item.-type2': { top: 0, left: 0, transform: 'none', transformOrigin: '100% 100%' },
  '& > .item.-type2 > .line': {
    position: 'absolute',
    top: '41%',
    left: 'calc(30% - var(--lw-half))',
    width: '70%',
    height: '48%',
    borderRight: 'none',
    borderLeft: `var(--lw) dashed ${COLOR_LINE}`,
    borderBottom: `var(--lw) dashed ${COLOR_LINE}`,
    borderBottomLeftRadius: 'var(--cr-dyn, var(--cr))',
  },
  '& > .item.-type2 > .dot': { position: 'absolute', inset: 0 },
  '& > .item.-type2 > .dot::after': {
    content: "''",
    position: 'absolute',
    left: 'calc(30% - var(--lw-half))',
    top: '40%',
    transform: 'translate(-50%, -50%)',
    height: '0.6%',
    width: '0.4%',
    background: '#fc4d57',
    border: `var(--dotbw) solid #fc4d57`,
    borderRadius: '8px',
    animation: `${moveDotCorner} ${SPEED} linear infinite`,
  },

  '& > .item.-type2 > .circle': { top: '30%', left: '30%', transform: 'translate(-50%, -50%)' },
  '& > .item.-type2.-tr': { transform: 'scaleX(-1)' },
  '& > .item.-type2.-br': { transform: 'scaleX(-1) scaleY(-1)' },
  '& > .item.-type2.-bl': { transform: 'scaleY(-1)' },
  '& > .item.-type2.-tr > .dot::after, & > .item.-type2.-br > .dot::after': { animationDirection: 'reverse' },
  '& > .item.-type2.-tr > .circle > img': { transform: 'scaleX(-1)' },
  '& > .item.-type2.-br > .circle > img': { transform: 'scaleX(-1) scaleY(-1)' },
  '& > .item.-type2.-bl > .circle > img': { transform: 'scaleY(-1)' },
  '& > .item.-type2.-tl > .dot::after, & > .item.-type2.-bl > .dot::after': { animation: `${moveDotCornerLeft} ${SPEED} linear infinite` },
  '& > .item.-type2.-tr > .dot::after, & > .item.-type2.-br > .dot::after': { animation: `${moveDotCornerRight} ${SPEED} linear infinite`, animationDirection: 'reverse' },

  /* TL — закруглення + допоміжні лінії */
  '& > .item.-type2.-tl': { '--cr': CORNER_R },
  '& > .item.-type2.-tl::before': {
    content: "''",
    position: 'absolute',
    top: 'calc(43% - var(--cr-dyn, var(--cr)))',
    left: 'calc(9% + 19%)',
    width: 'calc(76% - (30% + 19%))',
    height: 'var(--cr-dyn, var(--cr))',
    borderTop: `var(--lw) dashed ${COLOR_LINE}`,
    borderRight: `var(--lw) dashed ${COLOR_LINE}`,
    borderTopRightRadius: '8px',
    background: 'transparent',
    zIndex: 0,
    '@media (max-height:400px) and (min-width:801px)':{
       top: 'calc(48% - var(--cr-dyn, var(--cr)))',
    }
  },
  '& > .item.-type2.-tl > .line': {
    position: 'absolute',
    top: 'calc(41% + var(--cr-dyn, var(--cr)))',
    left: '55%',
    width: '44%',
    height: 'calc(48% - var(--cr-dyn, var(--cr)))',
    border: 'none',
  },
  '& > .item.-type2.-tl > .line::before': { content: "''", position: 'absolute', top: 0, left: 0, height: 'calc(100% - var(--cr-dyn, var(--cr)))', borderLeft: `var(--lw) dashed ${COLOR_LINE}` },
  '& > .item.-type2.-tl > .line::after': {
    content: "''", position: 'absolute', bottom: 0, left: 0, width: '100%', height: 'var(--cr-dyn, var(--cr))',
    borderLeft: `var(--lw) dashed ${COLOR_LINE}`, borderBottom: `var(--lw) dashed ${COLOR_LINE}`, borderBottomLeftRadius: '8px', background: 'transparent',
  },
  '& > .item.-type2.-tl > .dot::after': { left: 'calc(30% + 19% - var(--lw-half))', top: '40%', animation: `${moveDotTLZig} ${SPEED} linear infinite` },

  /* TR — дзеркало до TL */
  '& > .item.-type2.-tr': { '--cr': CORNER_R, transform: 'scaleX(-1)' },
  '& > .item.-type2.-tr::before': {
    content: "''",
    position: 'absolute',
    top: 'calc(43% - var(--cr-dyn, var(--cr)))',
    left: 'calc(9% + 19%)',
    width: 'calc(76% - (30% + 19%))',
    height: 'var(--cr-dyn, var(--cr))',
    borderTop: `var(--lw) dashed ${COLOR_LINE}`,
    borderRight: `var(--lw) dashed ${COLOR_LINE}`,
    borderTopRightRadius: '8px',
    background: 'transparent',
    zIndex: 0,
  },
  '& > .item.-type2.-tr > .line': { position: 'absolute', top: 'calc(41% + var(--cr-dyn, var(--cr)))', left: '55%', width: '43%', height: 'calc(48% - var(--cr-dyn, var(--cr)))', border: 'none' },
  '& > .item.-type2.-tr > .line::before': { content: "''", position: 'absolute', top: 0, left: 0, height: 'calc(100% - var(--cr-dyn, var(--cr)))', borderLeft: `var(--lw) dashed ${COLOR_LINE}` },
  '& > .item.-type2.-tr > .line::after': {
    content: "''", position: 'absolute', bottom: 0, left: 0, width: '100%', height: 'var(--cr-dyn, var(--cr))',
    borderLeft: `var(--lw) dashed ${COLOR_LINE}`, borderBottom: `var(--lw) dashed ${COLOR_LINE}`, borderBottomLeftRadius: '8px', background: 'transparent',
  },
  '& > .item.-type2.-tr > .dot::after': { left: 'calc(30% + 19% - var(--lw-half))', top: '40%', animation: `${moveDotTLZig} ${SPEED} linear infinite` },

  /* TL картка */
  '& > .item.-type2.-tl > .circle': { marginTop: '5%', width: '35%', height: '25%', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginLeft: '-20%','@media (max-width: 800px)': {
        padding: '0 0px',
      },'@media (max-height: 450px) and (min-width: 801px)': {
      paddingTop:'4px',
      paddingBottom:'4px'
    },
   '@media (max-width: 500px)': {
      width:'70px',
      height:'50px'
    }, },
  '& > .item.-type2.-tl > .circle .iconBox': { height: '90%', aspectRatio: '1 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  '& > .item.-type2.-tl > .circle .iconBox > img': { height: '100%', width: 'auto', maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', marginRight: '15%','@media (max-width: 800px)': {
     height:'70%',
     width:'100%',
     '@media (max-height: 450px) and (min-width: 801px)': {
     height:'100%'
    } 
    }  },
  '& > .item.-type2.-tl > .circle .bigNum': { lineHeight: 1, fontWeight: 300, color: '#2b2b2b', fontSize: '48px', flexShrink: 0, marginLeft: '15%', fontVariantNumeric: 'tabular-nums', fontFeatureSettings: '"tnum"', '@media (max-width: 800px)': {
        fontSize: '25px',
      },'@media (max-height: 450px) and (min-width: 801px)': {
     fontSize:'22px'
    },'@media (max-width: 500px)': {
     fontSize:'15px'
    }  },

  /* === TL STATS === */
  '& > .item.-type2.-tl > .stats': { position: 'absolute', left: '10%', top: 'calc(40% + 18%)', transform: 'translate(-50%, 0)', display: 'grid', rowGap: '10px', width: '34%', zIndex: 3, pointerEvents: 'none','@media (max-height: 450px) and (min-width: 801px)': {
        rowGap: '0px',
        top: 'calc(40% + 24%)',
    },
  '@media (max-width: 600px)': {
        left: '0%',
        width: '100%',
        transform: 'translate(0px, 0px) scaleY(1)',
        margin: '0px',
        marginLeft: '-15px',
        top: 'calc(40% + 14%)',
        rowGap:0
    },
    "@media (max-width: 600px) and (max-height: 600px)": { 
           top: 'calc(40% + 24%)',
    },
      "@media (max-width: 600px) and (max-height: 350px)": { 
           top: 'calc(40% + 34%)',
    }
  
  },
  '& > .item.-type2.-tl > .stats .row': { display: 'inline-flex', gridTemplateColumns: 'auto max-content auto', alignItems: 'center', columnGap: '8px', lineHeight: 1.1,'@media (max-width: 380px)': {
        columnGap: '3px',
      } },
  '& > .item.-type2.-tl > .stats .row.-pair': { display: 'flex', alignItems: 'center', gap: '14px','@media (max-width: 380px)': {
        gap: '3px',
      } },
  '& > .item.-type2.-tl > .stats .grp': { display: 'inline-flex', alignItems: 'center', gap: '8px','@media (max-width: 380px)': {
        gap: '3px',
      } },
  '& > .item.-type2.-tl > .stats .ico': { height: '26px', width: 'auto','@media (max-width: 1000px)': {
        height: '18px',
      },'@media (max-width: 800px)': {
        height: '12px',
      },'@media (max-width: 380px)': {
        height: '10px',
      },'@media (max-height: 450px) and (min-width: 801px)': {
     height:'15px'
    } },
  '& > .item.-type2.-tl > .stats .val': {
      fontSize: '26px', color: '#fc4d57', 
      fontWeight: 800,
      display: 'inline-block',
      '@media (max-width: 1200px)': {
        fontSize: '20px',
      },
      '@media (max-width: 1000px)': {
        fontSize: '17px',
      },
      '@media (max-width: 800px)': {
        fontSize: '12px',
      },
      '@media (max-width: 380px)': {
        fontSize: '10px',
      },
      '@media (max-height: 450px) and (min-width: 801px)': {
        fontSize: '18px',
    }, },
  '& > .item.-type2.-tl > .stats .suffix': { fontWeight: 600, fontSize: '18px', color: '#9397a1','@media (max-width: 1200px)': {
        fontSize: '16px',
      },'@media (max-width: 1000px)': {
        fontSize: '14px',
      },'@media (max-width: 800px)': {
        fontSize: '12px',
      },'@media (max-width: 380px)': {
        fontSize: '10px',
      },'@media (max-height: 450px) and (min-width: 801px)': {
        fontSize: '14px',
    } },

  /* === TR STATS === */
  '& > .item.-type2.-tr > .stats': { position: 'absolute', right: '90%', top: 'calc(40% + 18%)', transform: 'translate(50%, 0) scaleX(-1)', display: 'grid', rowGap: '10px', width: '34%', zIndex: 3, pointerEvents: 'none','@media (max-height: 450px) and (min-width: 801px)': {
        rowGap: '0px',
        top: 'calc(40% + 24%)',
    },
   '@media (max-width: 600px)': {
        left: '0%',
        width: '100%',
        transform: 'translate(0px, 0px) scaleX(-1)',
        margin: '0px',
        top: 'calc(40% + 14%)',
        justifyContent:'flex-end',
        marginLeft: '-15px',
          rowGap:0
    },
    "@media (max-width: 600px) and (max-height: 600px)": { 
           top: 'calc(40% + 24%)',
    },
      "@media (max-width: 600px) and (max-height: 350px)": { 
           top: 'calc(40% + 34%)',
    }
  },
  '& > .item.-type2.-tr > .stats .row': { display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', lineHeight: 1.1,'@media (max-width: 380px)': {
        gap: '3px',
      } },
  '& > .item.-type2.-tr > .stats .ico, & > .item.-type2.-tr > .stats .val, & > .item.-type2.-tr > .stats .suffix': { flex: '0 0 auto' },
  '& > .item.-type2.-tr > .stats .ico': { height: '26px', width: 'auto','@media (max-width: 1000px)': {
        height: '18px',
      },'@media (max-width: 800px)': {
        height: '12px',
      },'@media (max-width: 380px)': {
        height: '10px',
      },'@media (max-height: 450px) and (min-width: 801px)': {
     height:'15px'
    } },
  '& > .item.-type2.-tr > .stats .val': {
      fontSize: '26px', color: '#fc4d57', 
      fontWeight: 800,
      display: 'inline-block',
      '@media (max-width: 1200px)': {
        fontSize: '20px',
      },
      '@media (max-width: 1000px)': {
        fontSize: '17px',
      },
      '@media (max-width: 800px)': {
        fontSize: '12px',
      },
      '@media (max-width: 380px)': {
        fontSize: '10px',
      },
      '@media (max-height: 450px) and (min-width: 801px)': {
        fontSize: '18px',
    }, },
  '& > .item.-type2.-tr > .stats .suffix': { fontWeight: 600, fontSize: '18px', color: '#9397a1','@media (max-width: 1200px)': {
        fontSize: '16px',
      },'@media (max-width: 1000px)': {
        fontSize: '14px',
      },'@media (max-width: 800px)': {
        fontSize: '12px',
      },'@media (max-width: 380px)': {
        fontSize: '10px',
      },'@media (max-height: 450px) and (min-width: 801px)': {
        fontSize: '14px',
    } },

  /* === BL STATS === */
  '& > .item.-type2.-bl > .stats': { position: 'absolute', left: '10%', top: 'calc(-15% + 18%)', transform: 'translate(-50%, 0) scaleY(-1)', display: 'grid', rowGap: '10px', width: '34%', zIndex: 3, pointerEvents: 'none','@media (max-height: 450px) and (min-width: 801px)': {
        rowGap: '0px',
        top: 'calc(-15% + 17%)',
    },'@media (max-width: 600px)': {
        left: '0%',
        width: '100%',
        transform: 'translate(0px, 0px) scaleY(-1)',
        margin: '0px',
        marginLeft: '-15px',
        top: 'calc(-15% + 13%)',
          rowGap:0
        
    } ,
    '@media (max-width: 600px) and (max-height:600px)': {
        top: 'calc(-15% + 0%)',
    }
,
  '@media (max-width: 600px) and (max-height:350px)': {
        top: 'calc(-12% - 15%)',
    }
  
  },
  '& > .item.-type2.-bl > .stats .row': { display: 'flex', alignItems: 'center', columnGap: '8px', lineHeight: 1.1,'@media (max-width: 380px)': {
        columnGap: '3px',
      } },
  '& > .item.-type2.-bl > .stats .row.-pair': { display: 'flex', alignItems: 'center', gap: '14px','@media (max-width: 380px)': {
        gap: '3px',
      } },
  '& > .item.-type2.-bl > .stats .grp': { display: 'inline-flex', alignItems: 'center', gap: '8px','@media (max-width: 380px)': {
        gap: '3px',
      } },
  '& > .item.-type2.-bl > .stats .ico': { height: '26px', width: 'auto','@media (max-width: 1000px)': {
        height: '18px',
      },'@media (max-width: 800px)': {
        height: '12px',
      },'@media (max-width: 380px)': {
        height: '10px',
      },'@media (max-height: 450px) and (min-width: 801px)': {
     height:'15px'
    } },
  '& > .item.-type2.-bl > .stats .val': {
      fontSize: '26px', color: '#fc4d57', 
      fontWeight: 800,
      display: 'inline-block',
      '@media (max-width: 1200px)': {
        fontSize: '20px',
      },
      '@media (max-width: 1000px)': {
        fontSize: '17px',
      },
      '@media (max-width: 800px)': {
        fontSize: '12px',
      },
      '@media (max-width: 380px)': {
        fontSize: '10px',
      },
      '@media (max-height: 450px) and (min-width: 801px)': {
        fontSize: '18px',
    }, },
  '& > .item.-type2.-bl > .stats .suffix': { fontWeight: 600, fontSize: '18px', color: '#9397a1','@media (max-width: 1200px)': {
        fontSize: '16px',
      },'@media (max-width: 1000px)': {
        fontSize: '14px',
      },'@media (max-width: 800px)': {
        fontSize: '12px',
      },'@media (max-width: 380px)': {
        fontSize: '10px',
      },'@media (max-height: 450px) and (min-width: 801px)': {
        fontSize: '14px',
    } },

  /* === BR STATS === */
  '& > .item.-type2.-br > .stats': { position: 'absolute', right: '90%', top: 'calc(-15% + 18%)', transform: 'translate(50%, 0) scaleX(-1) scaleY(-1)', display: 'grid', rowGap: '10px', width: '34%', zIndex: 3, pointerEvents: 'none','@media (max-height: 450px)': {
        rowGap: '0px',
        top: 'calc(-15% + 17%)',

    } ,
  '@media (max-width: 600px)': {
        left: '0%',
        width: '100%',
        transform: 'translate(0px, 0px) scaleX(-1)  scaleY(-1)',
        margin: '0px',
        top: 'calc(-15% + 13%)',
        justifyContent:'flex-end',
        marginLeft: '-15px',
        rowGap: '0px',
       },
  '@media (max-width: 600px) and (max-height:600px)': {
      top: 'calc(-15% + 0%)',
      },
      
  '@media (max-width: 600px) and (max-height:350px)': {
        top: 'calc(-12% - 15%)',
    }
  },
  
  '& > .item.-type2.-br > .stats .row': { display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', lineHeight: 1.1,'@media (max-width: 380px)': {
        gap: '3px',
      } },
  '& > .item.-type2.-br > .stats .ico, & > .item.-type2.-br > .stats .val, & > .item.-type2.-br > .stats .suffix': { flex: '0 0 auto' },
  '& > .item.-type2.-br > .stats .ico': { height: '26px', width: 'auto','@media (max-width: 1000px)': {
        height: '18px',
      },'@media (max-width: 800px)': {
        height: '12px',
      },'@media (max-width: 380px)': {
        height: '10px',
      },'@media (max-height: 450px) and (min-width: 801px)': {
     height:'15px'
    } },
  '& > .item.-type2.-br > .stats .val': {
      fontSize: '26px', color: '#fc4d57', 
      fontWeight: 800,
      display: 'inline-block',
      '@media (max-width: 1200px)': {
        fontSize: '20px',
      },
      '@media (max-width: 1000px)': {
        fontSize: '17px',
      },
      '@media (max-width: 800px)': {
        fontSize: '12px',
      },
      '@media (max-width: 380px)': {
        fontSize: '10px',
      },
      '@media (max-height: 450px) and (min-width: 801px)': {
        fontSize: '18px',
    }, },
  '& > .item.-type2.-br > .stats .suffix': { fontWeight: 600, fontSize: '18px', color: '#9397a1','@media (max-width: 1200px)': {
        fontSize: '16px',
      },'@media (max-width: 1000px)': {
        fontSize: '14px',
      },'@media (max-width: 800px)': {
        fontSize: '12px',
      },'@media (max-width: 380px)': {
        fontSize: '10px',
      },'@media (max-height: 450px) and (min-width: 801px)': {
        fontSize: '14px',
    } },

  /* Картки */
  '& > .item.-type2.-bl > .circle.-numCard, & > .item.-type2.-tr > .circle.-numCard, & > .item.-type2.-br > .circle.-numCard': {
    width: '35%', height: '25%', padding: '0 24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between','@media (max-width: 800px)': {
      padding: '0 12px',
    },'@media (max-height: 450px) and (min-width: 801px)': {
      paddingTop:'4px',
      paddingBottom:'4px'
    },
    '@media (max-width: 500px)': {
      width:'70px',
      height:'50px',
      flex: '0 0 100%',
      maxWidth:'100%'
    },
  },
  '& > .item.-type2.-bl > .circle.-numCard': { gap: '1.2vmin', transform: 'translate(-50%, -50%) scaleY(-1)', marginLeft: '-20%', marginTop: '5%' },
  '& > .item.-type2.-tr > .circle.-numCard': { gap: '1.2vmin', whiteSpace: 'nowrap', transform: 'translate(-50%, -50%) scaleX(-1)', marginTop: '5%', marginLeft: '-20%' },
  '& > .item.-type2.-br > .circle.-numCard': { gap: '20%', transform: 'translate(-50%, -50%) scaleX(-1) scaleY(-1)', marginLeft: '-20%', marginTop: '5%' },
  '& > .item.-type2.-bl > .circle.-numCard .iconBox, & > .item.-type2.-tr > .circle.-numCard .iconBox, & > .item.-type2.-br > .circle.-numCard .iconBox': {
    height: '90%', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  '& > .item.-type2.-bl > .circle.-numCard .bigNum, & > .item.-type2.-tr > .circle.-numCard .bigNum, & > .item.-type2.-br > .circle.-numCard .bigNum': {
    lineHeight: 1, fontWeight: 300, color: '#2b2b2b', fontSize: '48px', '@media (max-width: 800px)': {
        fontSize: '25px',
      },'@media (max-height: 450px) and (min-width: 801px)': {
     fontSize:'22px'
    },
    '@media (max-width: 500px)': {
      fontSize:'15px'
    },
  },

  /* Центр */
  '& > .center': { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', height: '55%', zIndex: 3 },
  '& > .center > .circle': { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
  '& > .center > .circle:nth-child(1)': {
    width: 'var(--center-w, 23%)', height: 'var(--center-h, 38%)', background: '#fff', boxShadow: '0 0 24px rgba(0,0,0,.12)',
    overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', padding: 'var(--pad-y, 0) var(--pad-x, 0)',
    '@media (max-width: 500px)': {
      paddingLeft:10,
      paddingRight:10
    }
  },
  '& > .center > .circle:nth-child(1) > img': { width: '80%', height: '100%', objectFit: 'contain', objectPosition: 'center','@media (max-width: 500px)': {
     width:'100%'
    }   },

  '& > .item.-bottom-main > .circle': { top: '28%', height: '25% !important', width: '35% !important', '@media (max-width: 500px)': {
      // top: '20%',
      paddingLeft:10,
      paddingRight:10,
    
    },'@media (max-height:400px)':{
      paddingTop:5,
      paddingBottom:5
    } },
  '& > .item.-bottom-main.-v-down > .line': { position: 'absolute', top: '30% !important', bottom: '18%', height: 'auto !important', left: '2%' },

  /* Допоміжні лінії для BL/TR/BR */
  '& > .item.-type2.-bl': { '--cr': CORNER_R, transform: 'scaleY(-1)' },
  '& > .item.-type2.-bl::before, & > .item.-type2.-tr::before, & > .item.-type2.-br::before': {
    content: "''", position: 'absolute', top: 'calc(42% - var(--cr-dyn, var(--cr)))', left: 'calc(9% + 19%)', width: 'calc(76% - (30% + 19%))',
    height: 'var(--cr-dyn, var(--cr))', borderTop: `var(--lw) dashed ${COLOR_LINE}`, borderRight: `var(--lw) dashed ${COLOR_LINE}`,
    borderTopRightRadius: '8px', background: 'transparent', zIndex: 0,
    '@media (max-height:400px) and (min-width:801px)':{
      top: 'calc(48% - var(--cr-dyn, var(--cr)))'
    }
  },
  '& > .item.-type2.-bl > .line, & > .item.-type2.-tr > .line, & > .item.-type2.-br > .line': { position: 'absolute', left: '55%', border: 'none' },
  '& > .item.-type2.-bl > .line': { top: 'calc(40% + var(--cr-dyn, var(--cr)))', width: '44%', height: 'calc(48% - var(--cr-dyn, var(--cr)))' },
  '& > .item.-type2.-tr > .line': { top: 'calc(41% + var(--cr-dyn, var(--cr)))', width: '43%', height: 'calc(48% - var(--cr-dyn, var(--cr)))' },
  '& > .item.-type2.-br > .line': { top: 'calc(40% + var(--cr-dyn, var(--cr)))', width: '43%', height: 'calc(48% - var(--cr-dyn, var(--cr)))' },
  '& > .item.-type2.-bl > .line::before, & > .item.-type2.-tr > .line::before, & > .item.-type2.-br > .line::before': { content: "''", position: 'absolute', top: 0, left: 0, height: 'calc(100% - var(--cr-dyn, var(--cr)))', borderLeft: `var(--lw) dashed ${COLOR_LINE}` },
  '& > .item.-type2.-bl > .line::after, & > .item.-type2.-tr > .line::after, & > .item.-type2.-br > .line::after': {
    content: "''", position: 'absolute', bottom: 0, left: 0, width: '100%', height: 'var(--cr-dyn, var(--cr))',
    borderLeft: `var(--lw) dashed ${COLOR_LINE}`, borderBottom: `var(--lw) dashed ${COLOR_LINE}`, borderBottomLeftRadius: '8px', background: 'transparent',
  },
  '& > .item.-type2.-bl > .dot::after': { left: 'calc(30% + 19% - var(--lw-half))', top: '40%', animation: `${moveDotBLZig} ${SPEED} linear infinite` },
  '& > .item.-type2.-br > .dot::after': { left: 'calc(30% + 19% - var(--lw-half))', top: '40%', animation: `${moveDotBRZig} ${SPEED} linear infinite`, animationDirection: 'reverse' },

  /* ERP stats */
  '& > .erp-stats': { position: 'absolute', left: '61.5%', top: '88%', transform: 'translateX(-50%)', display: 'grid', rowGap: '8px', width: '40%', pointerEvents: 'none', zIndex: 10000,'@media (max-height: 450px) and (min-width: 801px)': {
     rowGap:'0px'
    }, 
    '@media (max-width: 600px)': {
      rowGap:'0px'
    },
  '@media (max-width: 500px)': {
        left: '50%',
        width: '80%',
        transform: 'translateX(-50%)',
    }
  },
  '& > .erp-stats .row': { display: 'inline-flex', alignItems: 'baseline', gap: '8px', lineHeight: 1.1, whiteSpace: 'nowrap', '@media (max-width: 500px)': {
       justifyContent:'center'
    },'@media (max-width: 380px)': {
        gap: '3px',
      } },
  '& > .erp-stats .label': { fontWeight: 700, fontSize: '18px', color: '#9397a1', letterSpacing: '0.02em','@media (max-width: 1200px)': {
        fontSize: '16px',
      },'@media (max-width: 1000px)': {
        fontSize: '14px',
      },'@media (max-width: 800px)': {
        fontSize: '12px',
      },'@media (max-width: 380px)': {
        fontSize: '10px',
      },'@media (max-height: 450px) and (min-width: 801px)': {
     fontSize:'12px'
    }  },
  '& > .erp-stats .val': { fontSize: '26px', color: '#fc4d57', fontWeight: 800,'@media (max-width: 1200px)': {
        fontSize: '20px',
      },'@media (max-width: 1000px)': {
        fontSize: '17px',
      },'@media (max-width: 800px)': {
        fontSize: '12px',
      },'@media (max-width: 380px)': {
        fontSize: '10px',
      },'@media (max-height: 450px) and (min-width: 801px)': {
     fontSize:'18px'
    } },
  '& > .erp-stats .suffix': { fontWeight: 600, fontSize: '18px', color: '#9397a1','@media (max-width: 1200px)': {
        fontSize: '16px',
      },'@media (max-width: 1000px)': {
        fontSize: '14px',
      },'@media (max-width: 800px)': {
        fontSize: '12px',
      },'@media (max-width: 380px)': {
        fontSize: '10px',
      },'@media (max-height: 450px) and (min-width: 801px)': {
     fontSize:'14px'
    }  },

  /* ARROWS (ширина через var(--arroww)) */
  '& > .arrows-layer': { position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 },
  '& > .arrows-layer > .arrow, & > .arrows-layer > .arrow-bl, & > .arrows-layer > .arrow-tr, & > .arrows-layer > .arrow-b, & > .arrows-layer > .arrow-bc': {
    width: '1.5% !important', height: 'auto',
  },
  '& > .arrows-layer > .arrow':   { position: 'absolute', top: '44.5%', left: '39.5%', transform: 'translate(-40%, -50%)' },
  '& > .arrows-layer > .arrow-bl':{ position: 'absolute', top: '56.1%', left: '39.5%', transform: 'translate(-40%, -50%)', zIndex: 4 },
  '& > .arrows-layer > .arrow-tr':{ position: 'absolute', top: '44.5%', left: '60.2%', transform: 'translate(-40%, -50%) rotate(180deg)', zIndex: 4 },
  '& > .item.-type2.-br > .arrow-br': {
    position: 'absolute', top: '38.2%', left: '27%', transform: 'translate(-40%, -50%) rotate(180deg)',
    width: 'calc(1.5% * 1.8) !important', height: 'auto', zIndex: 4,
    '@media (max-height:400px) and (min-width:801px)':{
      top: 'calc(48% - var(--cr-dyn, var(--cr)))',
    }
    ,
    '@media (max-width:500px)':{
      top: 'calc(44% - var(--cr-dyn, var(--cr)))',
      transform: 'translate(0%, -50%) rotate(180deg)',
      left:'50px'
    }
  },
  '& > .arrows-layer > .arrow-b': { position: 'absolute', top: '60.5%', left: '47.8%', transform: 'translate(-40%, -50%) rotate(270deg)', zIndex: 4 },
  '& > .arrows-layer > .arrow-bc':{ position: 'absolute', top: '73.2%', left: '50.9%', transform: 'translate(-40%, -50%) rotate(90deg)', zIndex: 4 },

  /* Єдиний розмір іконки для всіх -numCard (BL / TR / BR) */
'& > .item.-type2.-tr > .circle.-numCard .iconBox, \
 & > .item.-type2.-bl > .circle.-numCard .iconBox, \
 & > .item.-type2.-br > .circle.-numCard .iconBox': {
  height: '90%',
  aspectRatio: '1 / 1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: '0 0 36%',      /* фіксований «квадрат» ~ третина картки */
  maxWidth: '36%',
  '@media (max-width: 800px)': {
    flex: '0 0 50%',
    maxWidth: '50%',
  },
},

'& > .item.-type2.-tr > .circle.-numCard .iconBox > img, \
  & > .item.-type2.-bl > .circle.-numCard .iconBox > img, \
  & > .item.-type2.-br > .circle.-numCard .iconBox > img': {
  width: '100%',
  height: '100%',
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
  objectPosition: 'center',
  margin: 0,
  padding: 0,
},

};

/* ====== 3) КОМПОНЕНТ ====== */
export default function EmpFlowchart({ images = {} }) {
  const frameRef = React.useRef(null);
  const cssVars = useResponsiveVars(frameRef);

  const {
    topLeft, topRight, bottomLeft, bottomRight, bottomCenter, center,
    number1, number2, number3, number4,
    icon1, icon2, icon3, stat1, stat2,
    stat3, stat2_1, stat2_2, stat3_1,
    stat3_2, stat3_3, stat4_1, stat4_2,
    stat5_1, stat5_2, arrow,
  } = images;

  const has2 = number2 != null;
  const has3 = number3 != null;
  const has4 = number4 != null;

  const fmt = (n) => (typeof n === 'number' ? new Intl.NumberFormat('uk-UA').format(n).replace(/\u00A0/g, ' ') : n);

  return (
    <>
      <Global styles={{ body: { margin: 0, background: 'white', fontFamily: '"Open Sans", system-ui' } }} />
      <div className='erp-flowchart' style={stage}>
        <div ref={frameRef} style={{ position: 'relative', width: '100%', height: '110%' , ...cssVars }}>
          <div className="animation-example" css={wrapper}>
            <div className="item" css={{ display: 'none' }} />
            <div className="item" css={{ display: 'none' }} />

            {/* bottom main */}
            <div className="item -bottom-main -v-down">
              <div className="line" />
              <div className="dot" />
              <div className="circle" style={{ width: '55%', height: '20%', ['--pad-x']: '18px' }}>
                {bottomCenter && <img src={bottomCenter} alt="Bottom center" loading="lazy" decoding="async" />}
              </div>
            </div>

            {/* bottom parallel */}
            <div className="item -parallel -v-down">
              <div className="line" />
              <div className="dot" />
            </div>

            <div className="item" css={{ display: 'none' }} />

            {/* TL */}
            <div className="item -type2 -tl">
              <div className="line" />
              <div className="dot" />
              <div className="circle">
                <span className="bigNum">{number1}</span>
                <div className="iconBox">{topLeft && <img src={topLeft} alt="Top left" loading="lazy" decoding="async" />}</div>
              </div>
              {(icon1 || icon2 || icon3) && (stat1 != null || stat2 != null || stat3 != null) && (
                <div className="stats">
                  {stat1 != null && (
                    <div className="row">
                      {icon1 && <img className="ico" src={icon1} alt="money" loading="lazy" decoding="async" />}
                      <span className="val">{fmt(stat1)}</span>
                      <span className="suffix">ZŁ</span>
                    </div>
                  )}
                  {(stat2 != null || stat3 != null) && (
                    <div className="row -pair">
                      {stat2 != null && (
                        <span className="grp">
                          {icon2 && <img className="ico" src={icon2} alt="boxes" loading="lazy" decoding="async" />}
                          <span className="val">{fmt(stat2)}</span>
                        </span>
                      )}
                      {stat3 != null && (
                        <span className="grp">
                          {icon3 && <img className="ico" src={icon3} alt="people" loading="lazy" decoding="async" />}
                          <span className="val">{fmt(stat3)}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* TR */}
            <div className="item -type2 -tr">
              <div className="line" />
              <div className="dot" />
              {has3 ? (
                <div className="circle -numCard">
                  <span className="bigNum">{number3}</span>
                  <div className="iconBox">{topRight && <img src={topRight} alt="Top right" loading="lazy" decoding="async" />}</div>
                </div>
              ) : (
                <div className="circle" style={{ width: '55%', height: '25%', ['--pad-x']: '18px' }}>
                  {topRight && <img src={topRight} alt="Top right" loading="lazy" decoding="async" />}
                </div>
              )}
              {(stat2_1 != null || stat2_2 != null) && (
                <div className="stats">
                  {stat2_1 != null && (
                    <div className="row">
                      {icon1 && <img className="ico" src={icon1} alt="money" loading="lazy" decoding="async" />}
                      <span className="val">{fmt(stat2_1)}</span>
                      <span className="suffix">ZŁ</span>
                    </div>
                  )}
                  {stat2_2 != null && (
                    <div className="row">
                      {icon2 && <img className="ico" src={icon2} alt="boxes" loading="lazy" decoding="async" />}
                      <span className="val">{fmt(stat2_2)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* BL */}
            <div className="item -type2 -bl">
              <div className="line" />
              <div className="dot" />
              {has2 ? (
                <div className="circle -numCard">
                  <span className="bigNum">{number2}</span>
                  <div className="iconBox">{bottomLeft && <img src={bottomLeft} alt="Bottom left" loading="lazy" decoding="async" />}</div>
                </div>
              ) : (
                <div className="circle" style={{ width: '25%', height: '25%' }}>
                  {bottomLeft && <img src={bottomLeft} alt="Bottom left" loading="lazy" decoding="async" />}
                </div>
              )}

              {(stat3_1 != null || stat3_2 != null || stat3_3 != null) && (
                <div className="stats">
                  {stat3_1 != null && (
                    <div className="row">
                      {icon1 && <img className="ico" src={icon1} alt="money" loading="lazy" decoding="async" />}
                      <span className="val">{fmt(stat3_1)}</span>
                      <span className="suffix">ZŁ</span>
                    </div>
                  )}
                  {(stat3_2 != null || stat3_3 != null) && (
                    <div className="row -pair">
                      {stat3_2 != null && (
                        <span className="grp">
                          {icon2 && <img className="ico" src={icon2} alt="boxes" loading="lazy" decoding="async" />}
                          <span className="val">{fmt(stat3_2)}</span>
                        </span>
                      )}
                      {stat3_3 != null && (
                        <span className="grp">
                          {icon3 && <img className="ico" src={icon3} alt="people" loading="lazy" decoding="async" />}
                          <span className="val">{fmt(stat3_3)}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* BR */}
            <div className="item -type2 -br">
              <div className="line" />
              <div className="dot" />
              {has4 ? (
                <div className="circle -numCard">
                  <span className="bigNum">{number4}</span>
                  <div className="iconBox">{bottomRight && <img src={bottomRight} alt="Bottom right" loading="lazy" decoding="async" />}</div>
                </div>
              ) : (
                <div className="circle" style={{ width: '25%', height: '25%' }}>
                  {bottomRight && <img src={bottomRight} alt="Bottom right" loading="lazy" decoding="async" />}
                </div>
              )}
              {arrow && <img className="arrow-br" src={arrow} alt="" loading="lazy" decoding="async" />}
              {(stat4_1 != null || stat4_2 != null) && (
                <div className="stats">
                  {stat4_1 != null && (
                    <div className="row">
                      {icon1 && <img className="ico" src={icon1} alt="money" loading="lazy" decoding="async" />}
                      <span className="val">{fmt(stat4_1)}</span>
                      <span className="suffix">ZŁ</span>
                    </div>
                  )}
                  {stat4_2 != null && (
                    <div className="row">
                      {icon2 && <img className="ico" src={icon2} alt="boxes" loading="lazy" decoding="async" />}
                      <span className="val">{fmt(stat4_2)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* arrows layers */}
            <div className="arrows-layer">{arrow && <img className="arrow" src={arrow} alt="" loading="lazy" decoding="async" />}</div>
            <div className="arrows-layer">{arrow && <img className="arrow-bl" src={arrow} alt="" loading="lazy" decoding="async" />}</div>
            <div className="arrows-layer">{arrow && <img className="arrow-b" src={arrow} alt="" loading="lazy" decoding="async" />}</div>
            <div className="arrows-layer">{arrow && <img className="arrow-tr" src={arrow} alt="" loading="lazy" decoding="async" />}</div>
            <div className="arrows-layer">{arrow && <img className="arrow-bc" src={arrow} alt="" loading="lazy" decoding="async" />}</div>

            {/* center */}
            <div className="center">
              <div className="circle" style={{ ['--pad-x']: '20px', ['--center-min-w']: '0px', ['--center-min-h']: '0px' }}>
                {center && <img src={typeof center === 'string' ? center : center.src} alt={typeof center === 'string' ? 'Center' : (center.alt || 'Center')} loading="lazy" decoding="async" />}
              </div>
              <div className="circle" />
              <div className="circle" />
            </div>

            {/* ERP stats under bottom card */}
            {(stat5_1 != null || stat5_2 != null) && (
              <div className="erp-stats">
                {stat5_1 != null && (
                  <div className="row">
                    <span className="label">ZAMÓWIENIA:</span>
                    <span className="val">{fmt(stat5_1)}</span>
                    <span className="suffix">ZŁ</span>
                  </div>
                )}
                {stat5_2 != null && (
                  <div className="row">
                    <span className="label">SPRZEDAŻ:</span>
                    <span className="val">{fmt(stat5_2)}</span>
                    <span className="suffix">ZŁ</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}