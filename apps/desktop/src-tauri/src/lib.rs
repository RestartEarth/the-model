use std::time::Duration;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle().clone();
            // The window is created hidden. Enter borderless fullscreen once
            // AppKit has the window, then show it. Native macOS fullscreen
            // keeps a title bar, which a clicker should not have to clear.
            std::thread::spawn(move || {
                std::thread::sleep(Duration::from_millis(200));
                if let Some(window) = handle.get_webview_window("main") {
                    let _ = window.set_decorations(false);
                    #[cfg(target_os = "macos")]
                    let _ = window.set_simple_fullscreen(true);
                    #[cfg(not(target_os = "macos"))]
                    let _ = window.set_fullscreen(true);
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
