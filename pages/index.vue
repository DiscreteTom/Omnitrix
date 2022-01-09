<template>
  <div>
    <div class="outer">
      <div class="d-flex align-center justify-center omnitrix">
        <div class="inner">
          <div class="inner-block"></div>
        </div>
        <div class="inner">
          <div class="inner-block"></div>
        </div>
      </div>
    </div>
    <h2 style="width: 100%; text-align: center; font-style: italic">
      A browser based util tool set.
    </h2>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.outer {
  border: solid #616161 10px;
  border-radius: 50%;
  height: 320px;
  width: 320px;
  margin: 50px auto;
}
.omnitrix {
  border: solid #11050d 20px;
  border-radius: 50%;
  height: 300px;
  width: 300px;
  overflow: hidden;
  margin: auto;
  background: #8ed52d;
}

.inner {
  margin: 70px;
}

.inner-block {
  border: solid #11050d 20px;
  border-radius: 20px;
  background: #5e5c5b;
  width: 300px;
  height: 300px;
  transform: rotate(45deg);
}
</style>
