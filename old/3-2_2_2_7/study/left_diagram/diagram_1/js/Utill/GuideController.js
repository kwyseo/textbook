export class GuideController {
    constructor(guideEl) {
        this.guide = guideEl
    }

    SetGuide(x = 0, y = 0) {
        this.guide.style.positon = "absolute"

        this.guide.style.left = x + "px"
        this.guide.style.top = y + "px"
        this.guide.style.opacity = "0"

        this.isFirst = true
    }

    async StartTouchEvent(playDuration = 1.5, repeatDuration = 3) {
        playDuration = playDuration * 1000;
        repeatDuration = repeatDuration * 1000;

        this.isStart = true
    
        const animationStep = async () => {
            this.nowAnimation = this.guide.animate(
                [
                    { opacity: 0 },
                    { opacity: 1 },
                    { opacity: 0 },
                    { opacity: 1 },
                    { opacity: 0 },
                ],
                {
                    duration: playDuration,
                    fill: 'forwards'
                }
            );
            await new Promise(resolve => setTimeout(resolve, playDuration)); // 애니메이션이 끝날 때까지 기다립니다.
        };
    
        const repeatWithDelay = async () => {
            await animationStep();
            if (this.isStart)
                this.repeatInterval = setTimeout(repeatWithDelay, repeatDuration);
        };
    
        await repeatWithDelay();
    }
    
    async StopTouchEvent() {
        this.isStart = false
        clearInterval(this.repeatInterval);

        if (this.nowAnimation) {
            this.nowAnimation.cancel();
        }
    }

    
}