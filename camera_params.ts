import { BABYLON } from "pi_babylon/render3d/babylon";
import { FadeControl } from "./fade_control";

export class CameraParamsComputer {
    fov: number = 75 / 180 * Math.PI;
    public readonly position: BABYLON.Vector3 = BABYLON.Vector3.Zero();
    public readonly rotation: BABYLON.Vector3 = BABYLON.Vector3.Zero();
    public apply(camera: BABYLON.FreeCamera, deltax: number, deltaz: number) {
        camera.position.copyFromFloats(this.position.x + deltax, this.position.y, this.position.z + deltaz);
        camera.rotation.copyFrom(this.rotation);
        camera.fov = this.fov;
    }
    public updateFrom(camera: BABYLON.FreeCamera) {
        this.position.copyFrom(camera.position);
        this.rotation.copyFrom(camera.rotation);
        this.fov = camera.fov;
    }
    public static pow = 0.3;
    public static updateWithScale(scale: number, fov: number, deltaAngle: number, startScale: number, endScale: number, resultPosition: BABYLON.Vector3, resultRotation: BABYLON.Vector3, endDiffFade: number, endDiffRotation: BABYLON.Vector3, endDiffY: number) {

        let fadeBase = (scale - startScale) / (endScale - startScale);
        fadeBase = Math.min(1.0, Math.max(0.0, fadeBase));
        let fade = Math.pow(fadeBase, this.pow);

        let radians = deltaAngle / 180 * Math.PI * fade;
        let distance = (scale / 2) / Math.tan(fov / 2) * (1.0 - fade);

        // 在末端的 0.1 进度内完成角度差异矫正
        let diffRotationX = endDiffRotation.x;
        let diffRotationY = endDiffRotation.y % (Math.PI * 2);
        let diffFade = Math.min(endDiffFade, Math.max(0.0, fadeBase - (1.0 - endDiffFade))) / endDiffFade;
        diffRotationX *= diffFade;
        diffRotationY *= diffFade;

        resultPosition.copyFromFloats(
            0,
            distance * Math.cos(radians) + endDiffY * diffFade,
            -distance * Math.sin(radians)
        );

        resultRotation.copyFromFloats(
            90 / 180 * Math.PI - radians + diffRotationX,
            0 + diffRotationY,
            0
        );
    }
}