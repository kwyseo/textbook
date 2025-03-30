export class ScrollController {
    constructor(area, content, bar, thumb, main) {
        this.main = main

        this.area = area
        this.content = content

        this.bar = bar
        this.thumb = thumb
    }

    Init () {

        // this.UpdateScrollbarThumbHeight()
        this.MouseDownEvent()
        this.WheelEvent()
    }

    WheelEvent() {
        this.area.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY;

            this.contentBnd = this.content.getBoundingClientRect()
            console.log(this.contentBnd)
            
            // const contentHeight = this.content.scrollHeight - this.content.clientHeight;
            // const currentTop = -parseFloat(this.style.top || '0');
            // const newTop = Math.min(Math.max(currentTop + delta, 0), contentHeight);
            // const scrollPercent = newTop / contentHeight;
            // this.UpdateThumbPosition(scrollPercent);
            // this.UpdateContentPosition(scrollPercent);
        });
    }

    MouseDownEvent() {
        this.thumb.addEventListener('mousedown', function(e) {
            e.preventDefault();
            const startY = e.clientY;
            const startTop = this.thumb.offsetTop;

            const onMouseMove = (e) => {
                const deltaY = e.clientY - startY;
                const newTop = Math.min(Math.max(startTop + deltaY, 0), this.bar.clientHeight - this.thumb.clientHeight);
                const scrollPercent = newTop / (this.bar.clientHeight - this.thumb.clientHeight);
                this.UpdateThumbPosition(scrollPercent);
                this.UpdateContentPosition(scrollPercent);
            };

            const onMouseUp = () => {
                this.main.viewWrap.removeEventListener('mousemove', onMouseMove);
                this.main.viewWrap.removeEventListener('mouseup', onMouseUp);
            };

            this.main.viewWrap.addEventListener('mousemove', onMouseMove);
            this.main.viewWrap.addEventListener('mouseup', onMouseUp);
        });
    }

    UpdateScrollbarThumbHeight() {
        console.log(this.area, this.content, this.bar, this.thumb)
        console.log(this.area.offsetHeight)
        const containerHeight = 439;
        const contentHeight = 422;
        const scrollbarHeight = 387;
        const thumbHeight = Math.max((containerHeight / contentHeight) * scrollbarHeight, 20); // 최소 높이 설정
        console.log(containerHeight, contentHeight, scrollbarHeight)
        this.thumb.style.height = `${thumbHeight}px`;
    };

    UpdateContentPosition (scrollPercent) {
        const contentHeight = scrollContent.scrollHeight - scrollContainer.clientHeight;
        scrollContent.style.top = `-${scrollPercent * contentHeight}px`;
    };

    UpdateThumbPosition (scrollPercent) {
        const scrollbarHeight = scrollbar.clientHeight - scrollbarThumb.clientHeight;
        scrollbarThumb.style.top = `${scrollPercent * scrollbarHeight}px`;
    };
}