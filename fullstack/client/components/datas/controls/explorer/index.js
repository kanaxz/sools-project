const sools = require("sools");
const Definition = require("sools-ui/Definition");
const Properties = require("sools-define/Properties");
var Control = require("sools-ui/Control")
const datas = require("datas");
const Array = require("sools-define/Array");
const InterfacesPanel = require("./panels/Interfaces");
require("./index.scss");



module.exports = sools.define(Control, [Array()], (base) => {
    class Explorer extends base {

        constructor() {
            super();
            this.build();
        }

        removeFromIndex(index) {
            for (var i = this.length - 1; i >= index; i--) {
                this.remove(this[i]);
            }
        }

        close(panel) {
            var index = this.indexOf(panel);
            this.removeFromIndex(index);
        }

        show(sourcePanel, newPanel) {
            var index = this.indexOf(sourcePanel);
            this.removeFromIndex(index + 1);
            newPanel.actions.push({
                icon:'times',
                action:function(){
                    this.close();
                }
            })
            this.push(newPanel);
            setTimeout(()=>{
                this.container.scrollLeft = 10000000000;    
            },0)
            
        }

        build() {
            this.push(new InterfacesPanel(datas));
        }

        panelTemplate(parel) {
            return panel;
        }

    }
    return Explorer
}, [
    new Definition({
        name: "datas-explorer",
        template: require("./index.html")
    })
])