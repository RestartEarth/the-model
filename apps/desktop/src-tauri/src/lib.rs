use std::time::Duration;

use tauri::{Manager, PhysicalPosition, PhysicalSize, WebviewWindow};

/// The venue projectors are 1920×1080. When one is connected, the show opens
/// there so the stage is rasterized for that display. Rehearsal with only the
/// built-in panel fullscreen that panel instead.
fn audience_monitor(window: &WebviewWindow) -> Option<tauri::Monitor> {
    let monitors = window.available_monitors().ok()?;
    if monitors.len() < 2 {
        return None;
    }
    if let Some(projector) = monitors.iter().find(|monitor| {
        let size = monitor.size();
        size.width == 1920 && size.height == 1080
    }) {
        return Some(projector.clone());
    }
    let primary = window.primary_monitor().ok().flatten();
    monitors.into_iter().find(|monitor| match &primary {
        Some(primary) => {
            monitor.position() != primary.position() || monitor.size() != primary.size()
        }
        None => true,
    })
}

fn present_on_audience_display(window: &WebviewWindow) {
    let _ = window.set_decorations(false);
    if let Some(monitor) = audience_monitor(window) {
        let position = monitor.position();
        let size = monitor.size();
        // Physical pixels, so a 1080p projector is filled 1:1 instead of
        // drawing on the Retina panel and scaling down.
        let _ = window.set_position(PhysicalPosition::new(position.x, position.y));
        let _ = window.set_size(PhysicalSize::new(size.width, size.height));
    }
    #[cfg(target_os = "macos")]
    let _ = window.set_simple_fullscreen(true);
    #[cfg(not(target_os = "macos"))]
    let _ = window.set_fullscreen(true);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle().clone();
            // The window is created hidden. Place it after AppKit has the
            // window, then show it. Native macOS fullscreen keeps a title bar.
            std::thread::spawn(move || {
                std::thread::sleep(Duration::from_millis(200));
                let app = handle.clone();
                let _ = handle.run_on_main_thread(move || {
                    if let Some(window) = app.get_webview_window("main") {
                        present_on_audience_display(&window);
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                });
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
