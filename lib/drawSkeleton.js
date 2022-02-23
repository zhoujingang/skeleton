function drawSkeleton() {
    class DrawDom {
        constructor(options) {
            this.options = options;
            this.win_w = window.innerWidth; // 屏幕宽
            this.win_h = window.innerHeight; // 屏幕高
            this.Elements = ['IMG', 'INPUT', 'TEXTAREA', 'SVG']
            this.ignores = ['SCRIPT', 'STYLE']; // 忽略节点
            this.ignoresBlock = []; // 忽略模块
            this.ignoreClass = ['skin-container', 'wrap'] //
            this.ignoreId = ['skin-container'] //
            this.rootNode = document.body;
            this.styleMixin = `@keyframes opacity {
                0% { opacity: 1 }
                50% { opacity: .5 }
                100% { opacity: 1 }
              }`;
            this.template = [];
            this.commonClass();
            this.deepNodes(this.rootNode);
            this.showSkeleton();
            // console.log('template', this.template)
        }
        html() {
            return this.template.join('')
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
                if (this.ignores.includes(nodeName)) continue;
                if (!this.isVisibility(node)) continue
                const childNodes = node.childNodes || [];

                for (let j = 0; j < childNodes.length; j++) {
                    if (childNodes[j].nodeType === 3 && childNodes[j].textContent.trim().length) {
                        hasText = true;
                        break;
                    }
                }
                if (
                    !classNames.some(x => this.ignoreClass.includes(`${x.trim()}`)) &&
                    !this.ignoreId.includes(`${id.trim()}`) &&
                    (
                        this.Elements.includes(nodeName.toUpperCase()) ||
                        hasText ||
                        this.isFilled(node) ||
                        node.nodeType === 3 && node.textContent.trim().length)) {
                    const { t, l, w, h } = this.getRect(node);
                    // TODO 条件需要完善
                    if (w > 0 && h > 0 && l < this.win_w && t < this.win_h) {
                        const { pT, pL, pB, pR } = this.getPadding(node);
                        this.drawDom({
                            // width: this.wPercent(w),
                            // height: this.hPercent(h),
                            // top: this.hPercent(t),
                            // left: this.wPercent(l),
                            width: this.wPercent(w - pL - pR),
                            height: this.hPercent(h - pT - pB),
                            top: this.hPercent(t + pT),
                            left: this.wPercent(l + pL),
                            radius: this.getStyle(node, 'border-radius')
                        })
                    }
                } else if (childNodes.length > 0) {
                    this.deepNodes(node)
                }
            }
        }


        /**
         * 绘制节点
         * @param {s} param0 
         */
        drawDom({ width, height, top, left, radius, subClas } = {}) {
            const styles = ['height:' + height + '%'];

            if (!subClas) {
                styles.push('top:' + top + '%', 'left:' + left + '%', 'width:' + width + '%');
            }

            // if (classProps.zIndex !== zIndex) {
            //     styles.push('z-index:' + zIndex);
            // }

            // if (classProps.background !== background) {
            //     styles.push('background:' + background);
            // }

            radius && radius != '0px' && styles.push('border-radius:' + radius);
            this.template.push(`<div class="_${subClas ? ' __' : ''}" style="${styles.join(';')}"></div>`);
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
            const {w, h} = this.getRect(node);
            return w < 0.95 * this.win_w && h < 0.35 * this.win_h && (!hasNoBorder || bg.indexOf('url(') >= 0 || bg.indexOf('gradient') >= 0 || bgShadow !== 'none')
            // console.log(getComputedStyle(node))
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