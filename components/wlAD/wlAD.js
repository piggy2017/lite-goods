Component({
    properties: {
        adData: Object,
    },
    attached: function () {
        this.setData({
            adID: this.dataset.id
        });
    },
    methods: {
        clickAd(e) {
            if(e.currentTarget.dataset.type==='insert'){
                this.triggerEvent('close')
            }
            this.triggerEvent('click');
        },
        close() {
            this.triggerEvent('close')
        }
    }
});