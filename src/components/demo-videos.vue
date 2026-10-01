<template>
  <panel
  title="Webex Contact Center v8 Videos"
  aria-id="demo-videos"
  class="demo-videos"
  >
    <p class="demo-videos-note">
      Watch these videos before you start the demo.
      <a
      :href="pageUrl"
      target="_blank"
      rel="noopener noreferrer"
      >
        Open in Vidcast
      </a>
    </p>
    <div class="demo-videos-frame">
      <iframe
      :src="embedUrl"
      title="Webex Contact Center v8 Videos"
      allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
      allowfullscreen
      loading="lazy"
      referrerpolicy="strict-origin-when-cross-origin"
      />
    </div>
  </panel>
</template>

<script>
export default {
  data () {
    return {
      pageUrl: 'https://app.vidcast.io/pages/1623560b-4ddf-4fb6-8673-ff8f328226a3',
      embedUrl: 'https://app.vidcast.io/pages/embed/1623560b-4ddf-4fb6-8673-ff8f328226a3?theme=light'
    }
  }
}
</script>

<style scoped>
.demo-videos {
  width: min(72rem, calc(100vw - 2rem));
}

.demo-videos-note {
  margin-bottom: 0.75rem;
}

.demo-videos-frame {
  width: 100%;
  height: 36rem;
  border: 1px solid rgb(204, 204, 204);
}

.demo-videos-frame iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}

@media (max-width: 768px) {
  .demo-videos-frame {
    height: 24rem;
  }
}
</style>
