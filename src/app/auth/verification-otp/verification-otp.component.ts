import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-verification-otp',
  templateUrl: './verification-otp.component.html',
  styleUrls: ['./verification-otp.component.scss']
})
export class VerificationOtpComponent {
 otpArray = Array(6).fill(0);
  otp: string[] = new Array(6).fill('');
  isError: boolean = false;
loading = true;
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ContinueTochange() {
    this.router.navigate(['/auth/reset-password']);
  }

  ngOnInit() {
    // Simuler un chargement (ex: appel API, images…)
    window.addEventListener("load", () => {
      const loader = document.getElementById("loader");
      const content = document.getElementById("content");

      // On attend un petit délai pour l'effet
      setTimeout(() => {//@ts-ignore
        loader.classList.add("hidden"); //@ts-ignore
        content.style.display = "block";
      }, 1000);
    });
  }

  focusNext(event: any, index: number) {
    if (event.target.value && index < 5) {
      const next = document.querySelectorAll<HTMLInputElement>('.otp-inputs input')[index + 1];
      next.focus();
    }
  }

  verifyOtp() {
    const code = this.otp.join('');
    console.log('Code OTP saisi :', code);

    // 👉 Exemple de vérification (à remplacer par ton API)
    if (code !== "123456") {
      this.isError = true;

      // Effacer l’erreur après un délai (optionnel)
      setTimeout(() => this.isError = false, 2000);
    } else {
      this.isError = false;
      console.log("✅ Code correct !");
      this.ContinueTochange()
      // 👉 Redirection ou suite du process
    }
  }

  resendCode() {
    console.log('Code renvoyé');
    // 👉 Appel API de renvoi du code
  }
}
