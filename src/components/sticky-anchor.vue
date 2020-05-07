<template>
  <div class="cpt-sticky">
    <div
      class="sticky-container"
      :class="fixedClass"
      :style="{ top: top + 'px', zIndex }"
    >
      <slot></slot>
    </div>
    <div
      v-if="showPlaceholder"
      class="sticky-placeholder"
      :style="{ height: offsetHeight + 'px' }"
    ></div>
  </div>
</template>

<script>
import { getFirstScrollElement } from "util";

export default {
  props: {
    top: {
      type: Number,
      default: 0
    },
    zIndex: {
      type: Number,
      default: 0
    },
    parent: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      isMounted: false,
      fixedClass: "",
      offsetHeight: 0,
      scrollElement: null,
      showPlaceholder: false
    };
  },

  mounted() {
    this.isMounted = true;
    this.initScrollElement();
  },

  watch: {
    parent: {
      immediate: true,
      handler: "getScrollElement"
    },

    fixedClass(v) {
      if (v && !this.offsetHeight) {
        this.offsetHeight = this.$el.offsetHeight;
      }
      this.showPlaceholder = !!v;
    }
  },

  destroyed() {
    this.removeScrollEvent();
  },

  methods: {
    handleScroll(e) {
      const scrollOffsetTop = this.$el.offsetTop - this.top;
      if (this.scrollElement.scrollTop >= scrollOffsetTop) {
        this.fixedClass = "top-fixed";
      } else {
        this.fixedClass = "";
      }
    },

    initScrollElement() {
      if (!this.isMounted) return;
      const parent = this.parent;
      let element = null;
      if (parent) {
        element = document.querySelector(parent);
        if (element === this.scrollElement) return;
      } else if (this.$el) {
        element = getFirstScrollElement(this.$el);
      }
      if (element) {
        this.removeScrollEvent();
        this.scrollElement = element;
        this.scrollElement.addEventListener("scroll", this.handleScroll);
      }
    },

    removeScrollEvent() {
      if (this.scrollElement) {
        this.scrollElement.removeEventListener("scroll", this.handleScroll);
      }
    }
  }
};
</script>

<style lang="scss">
.cpt-sticky {
  .top-fixed {
    position: fixed;
    width: 100%;
    background: #fff;
  }
}
</style>
