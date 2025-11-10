document.addEventListener("DOMContentLoaded",function(){const o=document.querySelectorAll(".post-entry");o.forEach((e,t)=>{e.style.animationDelay=`${t*.1}s`});const i={threshold:.1,rootMargin:"0px 0px -50px 0px"},n=new IntersectionObserver(function(e){e.forEach(e=>{e.isIntersecting&&(e.target.classList.add("revealed"),n.unobserve(e.target))})},i),a=document.querySelectorAll(".scroll-reveal");a.forEach(e=>n.observe(e)),document.querySelectorAll('a[href^="#"]').forEach(e=>{e.addEventListener("click",function(e){const t=this.getAttribute("href");if(t!=="#"&&t!==""){e.preventDefault();const n=document.querySelector(t);n&&n.scrollIntoView({behavior:"smooth",block:"start"})}})});let s=0;const e=document.querySelector(".header");window.addEventListener("scroll",function(){const t=window.pageYOffset||document.documentElement.scrollTop;e&&(t>s&&t>100?(e.style.transform="translateY(-100%)",e.style.transition="transform 0.3s ease-in-out"):e.style.transform="translateY(0)"),s=t},{passive:!0});const r=document.querySelectorAll("button, .button, a.button");r.forEach(e=>{e.addEventListener("click",function(e){const t=document.createElement("span"),n=this.getBoundingClientRect(),s=Math.max(n.width,n.height),o=e.clientX-n.left-s/2,i=e.clientY-n.top-s/2;t.style.width=t.style.height=s+"px",t.style.left=o+"px",t.style.top=i+"px",t.classList.add("ripple"),this.appendChild(t),setTimeout(()=>t.remove(),600)})}),window.addEventListener("beforeunload",function(){document.body.style.opacity="0",document.body.style.transition="opacity 0.3s ease-out"});const c=document.querySelectorAll("img");c.forEach(e=>{e.complete||(e.style.opacity="0",e.addEventListener("load",function(){this.style.transition="opacity 0.5s ease-in",this.style.opacity="1"}))});const l=document.querySelectorAll("#menu li");l.forEach((e,t)=>{e.style.opacity="0",e.style.transform="translateY(-10px)",setTimeout(()=>{e.style.transition="all 0.3s ease-out",e.style.opacity="1",e.style.transform="translateY(0)"},100*t)});const t=document.createElement("div");t.className="scroll-progress",t.style.cssText=`
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary), var(--secondary));
        z-index: 9999;
        transition: width 0.1s ease-out;
    `,document.body.appendChild(t),window.addEventListener("scroll",function(){const e=document.documentElement.scrollHeight-document.documentElement.clientHeight,n=window.scrollY/e*100;t.style.width=n+"%"},{passive:!0})});const style=document.createElement("style");style.textContent=`
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    button, .button {
        position: relative;
        overflow: hidden;
    }
`,document.head.appendChild(style)