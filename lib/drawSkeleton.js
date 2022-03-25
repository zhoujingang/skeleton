function drawSkeleton() {
    class DrawDom {
        constructor(options) {
            const {
                cutHeight,
                ignoreBlockByClass,
                ignoreDomByClass,
                ignoreDomById,
            } = options
            this.options = options;
            this.win_w = window.innerWidth; // 屏幕宽
            this.win_h = window.innerHeight; // 屏幕高
            this.Elements = ['IMG', 'INPUT', 'TEXTAREA', 'SVG'];
            this.ignores = ['SCRIPT', 'STYLE']; // 忽略节点
            this.cutHeight = cutHeight;
            this.rootNode = document.body;
            this.styleMixin = `@keyframes opacity {
                0% { opacity: 1 }
                50% { opacity: .5 }
                100% { opacity: 1 }
              }`;
            this.ignoreBlockByClass = ignoreBlockByClass;
            this.ignoreDomByClass = ignoreDomByClass;
            this.ignoreDomById = ignoreDomById;
            this.template = [];
            this.ReactTemplate = [];
            this.VueTemplate = [];
            this.commonClass();
            this.deepNodes(this.rootNode);
            this.showSkeleton();
        }
        html() {
            return {
                html: this.template.join(''),
                reactHtml: this.ReactTemplate.join('\r\n'),
                vueHtml: this.VueTemplate.join('\r\n')
            }
        }
        showSkeleton() {
            const blocksHTML = this.template.join('');
            const div = document.createElement('div');
            div.innerHTML = blocksHTML;
            document.body.appendChild(div);
        }


        /**
         * 公共样式
         */
        commonClass() {
            const classMixin = {
                position: 'fixed',
                zIndex: 9999,
                background: this.options.background
            }
            const inlineStyle = [`<style>${this.styleMixin} ._{`];
            inlineStyle.push(this.options.style);
            for (let key in classMixin) {
                inlineStyle.push(`${key === 'zIndex' ? 'z-index' : key}:${classMixin[key]};`);
            }
            inlineStyle.push('}.__{top:0%;left:0%;width:100%;}</style>');
            this.template.push(inlineStyle.join(''));
        }


        /**
         * 节点遍历
         * @param {*} root 
         * @returns
         */
        deepNodes(root) {
            if (!root) return
            const nodes = root.childNodes;
            for (let i = 0; i < nodes.length; i++) {
                let hasText = false;
                const node = nodes[i];
                const { nodeName, className, id } = node;
                const classNames = typeof className === 'string' && className.split(' ') || [];
                if (this.ignores.includes(nodeName)) continue; // 忽略节点，跳过
                if (!this.isVisibility(node)) continue; // 不可见节点，跳过
                if (classNames.some(x => this.ignoreBlockByClass.includes(`${x.trim()}`))) continue; //忽略模块， 跳过
                const childNodes = node.childNodes || [];
                for (let j = 0; j < childNodes.length; j++) {
                    if (childNodes[j].nodeType === 3 && childNodes[j].textContent.trim().length) {
                        hasText = true;
                        break;
                    }
                }
                if (
                    !classNames.some(x => this.ignoreDomByClass.includes(`${x.trim()}`)) &&
                    !this.ignoreDomById.includes(`${id.trim()}`) &&
                    (
                        this.Elements.includes(nodeName.toUpperCase()) ||
                        hasText ||
                        this.isFilled(node) ||
                        node.nodeType === 3 && node.textContent.trim().length)) {
                    const { t, l, w, h } = this.getRect(node);
                    // TODO 条件需要完善
                    if (w > 0 && h > 0 && l < this.win_w && t < this.win_h) {
                        const { pT, pL, pB, pR } = this.getPadding(node);
                        const dom = {
                            width: this.wPercent(w - pL - pR) + '%',
                            height: this.hPercent(h - pT - pB) + '%',
                            top: this.hPercent(t + pT - this.cutHeight) + '%',
                            left: this.wPercent(l + pL) + '%',
                            radius: this.getStyle(node, 'border-radius')
                        }
                        if (w == h && dom.radius === '50%') { // 如果元素是圆形,需要使用padding 百分比方式；
                            dom.paddingTop = this.wPercent(h - pL - pR) + '%';
                        }
                        this.drawDom(dom)
                        this.drawReactDom(dom)
                        this.drawVueDom(dom)
                    }
                } else if (childNodes.length > 0) {
                    this.deepNodes(node)
                }
            }
        }


        /**
         * 绘制正常节点
         * @param {s} param0 
         */
        drawDom({ width, height, top, left, radius, paddingTop, subClas } = {}) {
            const styles = ['top:' + top, 'left:' + left, 'width:' + width];
            if (paddingTop) {
                styles.push('padding-top:' + paddingTop)
            } else {
                styles.push('height:' + height);
            }
            radius && radius != '0px' && styles.push('border-radius:' + radius);
            this.template.push(`<div class="_${subClas ? ' __' : ''}" style="${styles.join(';')}"></div>`);
        }

        /**
         * 绘制 React Dom 节点
         * @param {*} param0 
         */
        drawReactDom({ width, height, top, left, radius, paddingTop, subClas } = {}) {
            const styles = [`top: "${top}"`, `left: "${left}"`, `width: "${width}"`];
            if (paddingTop) {
                styles.push(`paddingTop: "${paddingTop}"`);
            } else {
                styles.push(`height: "${height}"`)
            }
            radius && radius != '0px' && styles.push(`borderRadius: "${radius}"`);
            this.ReactTemplate.push(`<div className="_${subClas ? ' __' : ''}" style={{${styles.join(',')}}}></div>`);
        }
        /**
         * 绘制 Vue Dom 节点
         * @param {*} param0 
         */
        drawVueDom({ width, height, top, left, radius, paddingTop, subClas } = {}) {
            const styles = [`top: "${top}"`, `left: "${left}"`, `width: "${width}"`];
            if (paddingTop) {
                styles.push(`paddingTop: "${paddingTop}"`);
            } else {
                styles.push(`height: "${height}"`)
            }
            radius && radius != '0px' && styles.push(`borderRadius: "${radius}"`);
            this.VueTemplate.push(`<div class="_${subClas ? ' __' : ''}" :style={${styles.join(',')}}></div>`)
        }

        isHasContent() {

        }

        /**
         * 当前元素填充状态 Insert
         * @param {*} node 
         * @returns 
         */
        isFilled(node) {
            const bg = this.getStyle(node, 'background'),
                bgColorReg = /rgba\([\s\S]+?0\)/ig,
                bgShadow = this.getStyle(node, 'box-shadow'),
                bdReg = /(0px)|(none)/;
            const hasNoBorder = ['top', 'left', 'right', 'bottom'].some(item => {
                return bdReg.test(this.getStyle(node, 'border-' + item));
            });
            const { w, h } = this.getRect(node);
            return w < 0.95 * this.win_w && h < 0.35 * this.win_h && (!hasNoBorder || bg.indexOf('url(') >= 0 || bg.indexOf('gradient') >= 0 || bgShadow !== 'none')
        }


        /**
         * 当前元素可见 Insert
         * @param {*} node 
         * @returns Boolean
         */
        isVisibility(node) {
            const display = this.getStyle(node, 'display'),
                visibility = this.getStyle(node, 'visibility'),
                opacity = Number(this.getStyle(node, 'opacity')),
                zIndex = this.getStyle(node, 'z-index');
            return display !== 'none' &&
                opacity > 0 &&
                (zIndex === 'auto' || Number(zIndex) >= 0) &&
                visibility !== 'hidden'
        }

        /**
         * 获取元素的大小及其相对于视口的位置
         * @param {*} node 
         * @returns 
         */
        getRect(node) {
            if (!node) return {};
            const { top: t, left: l, width: w, height: h } = node.getBoundingClientRect();
            return { t, l, w, h };
        }

        /**
         * 获取节点 padding 值
         * @param {*} node 
         * @returns 
         */
        getPadding(node) {
            return {
                pT: parseInt(this.getStyle(node, 'paddingTop')),
                pL: parseInt(this.getStyle(node, 'paddingLeft')),
                pB: parseInt(this.getStyle(node, 'paddingBottom')),
                pR: parseInt(this.getStyle(node, 'paddingRight'))
            }
        }
        wPercent(x) {
            return parseFloat(x / this.win_w * 100).toFixed(3);
        }
        hPercent(x) {
            return parseFloat(x / this.win_h * 100).toFixed(3);
        }
        getStyle(node, attr) {
            return (node.nodeType === 1 ? getComputedStyle(node)[attr] : '') || '';
        }

    }
    const config = arguments[0];
    return new DrawDom(config).html()
}

module.exports = drawSkeleton;