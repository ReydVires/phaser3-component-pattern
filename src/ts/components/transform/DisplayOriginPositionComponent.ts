import { Component } from "../../modules/services/ComponentService";

type GameObject = (Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.ComputedSize & Phaser.GameObjects.Components.Origin & Phaser.GameObjects.Components.Transform) | Phaser.GameObjects.Rectangle

export class DisplayOriginPositionComponent implements Component {

	private _gameObject: GameObject;

	init (go: GameObject): void {
		this._gameObject = go;
	}

	getDisplayPositionFromCoordinate (x: number, y: number): Phaser.Math.Vector2 {
		return new Phaser.Math.Vector2(
			this._gameObject.x + ((x - this._gameObject.originX) * this._gameObject.displayWidth),
			this._gameObject.y + ((y - this._gameObject.originY) * this._gameObject.displayHeight)
		);
	}

}