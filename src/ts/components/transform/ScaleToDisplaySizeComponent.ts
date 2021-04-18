import { Component } from "../../modules/services/ComponentService";

type GameObject = (Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.ComputedSize & Phaser.GameObjects.Components.Transform) | Phaser.GameObjects.Rectangle

export class ScaleToDisplaySizeComponent implements Component {

	private _gameObject: GameObject;
	private _percent: number;

	constructor (percentage: number) {
		this._percent = percentage;
	}

	init (go: GameObject): void {
		this._gameObject = go;
	}

	awake (): void {
		this.setDisplaySize(this._percent * this._gameObject.width, this._percent * this._gameObject.height);
	}

	private setDisplaySize (width: number, height: number): void {
		this._gameObject.displayWidth = width;
		this._gameObject.displayHeight = height;
	}

}