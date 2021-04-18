import { Component } from "../../modules/services/ComponentService";

type GameObject = (Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.ComputedSize & Phaser.GameObjects.Components.Transform) | Phaser.GameObjects.Rectangle

export class DisplayOriginalRatioComponent implements Component {

	private _gameObject: GameObject;

	init (go: GameObject): void {
		this._gameObject = go;
	}

	get displayToOriginalHeightRatio (): number {
		return this._gameObject.displayHeight / this._gameObject.height;
	}

	get displayToOriginalWidthRatio (): number {
		return this._gameObject.displayWidth / this._gameObject.width;
	}

}