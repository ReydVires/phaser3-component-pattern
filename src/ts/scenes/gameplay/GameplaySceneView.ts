import { BaseView } from "../../modules/core/BaseView";
import { ScreenUtilController } from "../../modules/screenutility/ScreenUtilController";
import { Assets } from "../../collections/AssetGameplay";
import { FontAsset } from "../../collections/AssetFont";
import { ComponentService } from "../../modules/services/ComponentService";
import { ClickableComponent } from "../../components/ClickableComponent";
import { ResetPositionComponent } from "../../components/ResetPositionComponent";
import { ScaleToDisplaySizeComponent } from "../../components/transform/ScaleToDisplaySizeComponent";
import { PreferredDisplaySizeComponent } from "../../components/transform/PreferredDisplaySizeComponent";
import { DisplayOriginalRatioComponent } from "../../components/transform/DisplayOriginalRatioComponent";
import { ClickTweenScaleComponent } from "../../components/ClickTweenScaleComponent";

export const enum EventNames {
	onPlaySFXClick = "onPlaySFXClick",
	onClickLogo = "onClickLogo",
	onClickRestart = "onClickRestart",
	onCreateFinish = "onCreateFinish",
};

export class GameplaySceneView implements BaseView {

	event: Phaser.Events.EventEmitter;
	screenUtility: ScreenUtilController;

	private _restartKey: Phaser.Input.Keyboard.Key;
	private _components: ComponentService;

	constructor (private _scene: Phaser.Scene) {
		this.screenUtility = ScreenUtilController.getInstance();
		this.event = new Phaser.Events.EventEmitter();
		this._components = new ComponentService();
	}

	get restartKey (): Phaser.Input.Keyboard.Key {
		return this._restartKey;
	}

	create (): void {
		this._restartKey = this._scene.input.keyboard.addKey('R');
		this.createTestImage();
		this.createRestartButton();

		this._scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
			this._components.destroy();
		});

		this.event.emit(EventNames.onCreateFinish);
	}

	updateComponents (dt: number): void {
		this._components.update(dt);
	}

	private createTestImage (): void {
		const { centerX, centerY, width, height } = this.screenUtility;
		const props = {
			INTERNAL_COUNTER: "internalCounter",
		};

		const image = this._scene.add.image(centerX, centerY * 0.5, Assets.phaser_logo.key);
		image.setData(props.INTERNAL_COUNTER, 0);

		this._components.addComponent(image, new PreferredDisplaySizeComponent("MIN", width * 0.3, height * 0.3));
		this._components.addComponent(image, new DisplayOriginalRatioComponent());
		this._components.addComponent(image, new ClickTweenScaleComponent(this._scene.tweens, () => {
			this.event.emit(EventNames.onClickLogo, image.getData(props.INTERNAL_COUNTER));
		}));
		this._components.addComponent(image, new ClickableComponent(() => {
			(this._components.findComponent(image, ClickTweenScaleComponent) as ClickTweenScaleComponent).play();
			const internalCounter = image.getData(props.INTERNAL_COUNTER) as number;
			image.setData(props.INTERNAL_COUNTER, internalCounter + 1);
		}));

		const targetComponent = this._components.findComponent(image, DisplayOriginalRatioComponent) as DisplayOriginalRatioComponent;
		const image2 = this._scene.add.image(centerX, height * 0.825, Assets.phaser_logo.key);
		this._components.addComponent(image2, new ScaleToDisplaySizeComponent(targetComponent.displayToOriginalHeightRatio));
		this._components.addComponent(image2, new DisplayOriginalRatioComponent());
		this._components.addComponent(image2, new ClickTweenScaleComponent(this._scene.tweens, () => {
			if (!this._components.findComponent(image2, ResetPositionComponent)) {
				this._components.addComponent(image2, new ResetPositionComponent());
			}
			this._components.removeComponent(image, ClickableComponent);
			this._components.removeComponent(image2, ClickTweenScaleComponent);
		}));
		this._components.addComponent(image2, new ClickableComponent(() => {
			(this._components.findComponent(image2, ClickTweenScaleComponent) as ClickTweenScaleComponent)?.play();
		}));
	}

	private createRestartButton (): void {
		const { screenPercentage, centerX, centerY } = this.screenUtility;
		
		const textureKey = "BUTTON_TEXTURE_" + Math.random().toFixed(4);
		
		const generateTexture = (): void => {
			const textureInfoLocal = {
				width: 256,
				height: 72,
				color: 0xfafafa,
				radius: Math.ceil(20 * screenPercentage),
			};

			this._scene.make.graphics({ x: 0, y: 0, add: false})
				.fillStyle(textureInfoLocal.color, 1)
				.fillRoundedRect(0, 0, textureInfoLocal.width, textureInfoLocal.height, textureInfoLocal.radius)
				.generateTexture(textureKey, textureInfoLocal.width, textureInfoLocal.height);
		};
		generateTexture();

		const button = this._scene.add.sprite(centerX, centerY, textureKey);
		this._components.addComponent(button, new ScaleToDisplaySizeComponent(screenPercentage * 1.45));
		this._components.addComponent(button, new DisplayOriginalRatioComponent());
		this._components.addComponent(button, new ClickTweenScaleComponent(this._scene.tweens, () => {
			this.event.emit(EventNames.onClickRestart);
		}));

		const buttonRatioComponent = this._components.findComponent(button, DisplayOriginalRatioComponent) as DisplayOriginalRatioComponent;
		const labelContent = "RESTART";
		const style = <Phaser.Types.GameObjects.Text.TextStyle> {
			fontFamily: FontAsset.roboto.key,
			fontSize: `${32 * buttonRatioComponent.displayToOriginalHeightRatio}px`,
			color: "black",
		};
		const label = this._scene.add.text(button.x, button.y, labelContent, style);
		label.setOrigin(0.5);

		this._components.addComponent(label, new ClickTweenScaleComponent(this._scene.tweens));

		this._components.addComponent(button, new ClickableComponent(() => {
			(this._components.findComponent(label, ClickTweenScaleComponent) as ClickTweenScaleComponent).play();
			(this._components.findComponent(button, ClickTweenScaleComponent) as ClickTweenScaleComponent).play();
			this.event.emit(EventNames.onPlaySFXClick);
		}));
	}

	destroy (): void {
		this._components.destroy();
	}

}