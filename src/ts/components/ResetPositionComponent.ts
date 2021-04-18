import { Component } from "../modules/services/ComponentService";

export class ResetPositionComponent implements Component {

	private _gameObject: Phaser.GameObjects.Image;

	init (go: Phaser.GameObjects.Image): void {
		this._gameObject = go;
	}

	start (): void {
		this._gameObject.setOrigin(0.5).setPosition(256, 0);
	}

}