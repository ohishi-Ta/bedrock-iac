"use strict";
// lib/stacks/network-stack.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkStack = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const network_construct_1 = require("../constructs/network-construct");
class NetworkStack extends cdk.Stack {
    networkConstruct;
    constructor(scope, id, props) {
        super(scope, id, props);
        const { config } = props;
        // NetworkConstructを使用してネットワークリソースを作成
        this.networkConstruct = new network_construct_1.NetworkConstruct(this, 'Network', {
            config,
        });
        // 共通タグ設定
        this.applyCommonTags(config.tags);
    }
    applyCommonTags(tags) {
        Object.entries(tags).forEach(([key, value]) => {
            cdk.Tags.of(this).add(key, value);
        });
    }
}
exports.NetworkStack = NetworkStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0d29yay1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5ldHdvcmstc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFOUIsaURBQW1DO0FBRW5DLHVFQUFtRTtBQU9uRSxNQUFhLFlBQWEsU0FBUSxHQUFHLENBQUMsS0FBSztJQUN6QixnQkFBZ0IsQ0FBbUI7SUFFbkQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF3QjtRQUNoRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDO1FBRXpCLHFDQUFxQztRQUNyQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxvQ0FBZ0IsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQzVELE1BQU07U0FDUCxDQUFDLENBQUM7UUFFSCxTQUFTO1FBQ1QsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVPLGVBQWUsQ0FBQyxJQUErQjtRQUNyRCxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUU7WUFDNUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQXRCRCxvQ0FzQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBsaWIvc3RhY2tzL25ldHdvcmstc3RhY2sudHNcclxuXHJcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xyXG5pbXBvcnQgeyBOZXR3b3JrQ29uc3RydWN0IH0gZnJvbSAnLi4vY29uc3RydWN0cy9uZXR3b3JrLWNvbnN0cnVjdCc7XHJcbmltcG9ydCB7IEVudmlyb25tZW50Q29uZmlnIH0gZnJvbSAnLi4vY29uZmlnL2Vudmlyb25tZW50LWNvbmZpZyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE5ldHdvcmtTdGFja1Byb3BzIGV4dGVuZHMgY2RrLlN0YWNrUHJvcHMge1xyXG4gIGNvbmZpZzogRW52aXJvbm1lbnRDb25maWc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBOZXR3b3JrU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xyXG4gIHB1YmxpYyByZWFkb25seSBuZXR3b3JrQ29uc3RydWN0OiBOZXR3b3JrQ29uc3RydWN0O1xyXG5cclxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTmV0d29ya1N0YWNrUHJvcHMpIHtcclxuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xyXG5cclxuICAgIGNvbnN0IHsgY29uZmlnIH0gPSBwcm9wcztcclxuXHJcbiAgICAvLyBOZXR3b3JrQ29uc3RydWN044KS5L2/55So44GX44Gm44ON44OD44OI44Ov44O844Kv44Oq44K944O844K544KS5L2c5oiQXHJcbiAgICB0aGlzLm5ldHdvcmtDb25zdHJ1Y3QgPSBuZXcgTmV0d29ya0NvbnN0cnVjdCh0aGlzLCAnTmV0d29yaycsIHtcclxuICAgICAgY29uZmlnLFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g5YWx6YCa44K/44Kw6Kit5a6aXHJcbiAgICB0aGlzLmFwcGx5Q29tbW9uVGFncyhjb25maWcudGFncyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFwcGx5Q29tbW9uVGFncyh0YWdzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9KTogdm9pZCB7XHJcbiAgICBPYmplY3QuZW50cmllcyh0YWdzKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcclxuICAgICAgY2RrLlRhZ3Mub2YodGhpcykuYWRkKGtleSwgdmFsdWUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59Il19