import { ElementRef, Injectable } from '@angular/core';
import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';
@Injectable({
  providedIn: 'root'
})
export class SplashScreenService {
	private el!: ElementRef<HTMLElement>;
	private animationPlayer!: AnimationPlayer;
    constructor(private animationBuilder: AnimationBuilder) {
    }

    init(element: ElementRef) {
        this.el = element;
		this.animationPlayer = this.animationBuilder
		.build([style({ opacity: '0' }), animate(100, style({ opacity: '0.9' }))])
		.create(this.el.nativeElement);
		console.log("this.el1",this.el)	
    
    }

    show(message?: string) {
        if (this.animationPlayer) {
            this.animationPlayer.play();
            this.setMessage(message || 'Cargando');
            this.el.nativeElement.style.display = 'flex';
        }
        console.log("this.el2",this.el)	
    }

    hide() {
        if (this.animationPlayer) {
            this.animationPlayer.play();
            this.el.nativeElement.style.display = 'none';
        }
    }

    private setMessage(message: string) {
        this.el.nativeElement.lastChild!.textContent = `${message} ...`;
    }


}