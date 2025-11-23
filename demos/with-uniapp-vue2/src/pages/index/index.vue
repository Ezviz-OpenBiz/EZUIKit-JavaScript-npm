<template>
	<view class="content">
        <Player />
	</view>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Player from "../../components/Player.vue";

	export default Vue.extend({
		components: {
			Player,
		},
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {

		}
	});
</script>

<style>
	.content {
		width: 100%;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin: 200rpx auto 50rpx auto;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>