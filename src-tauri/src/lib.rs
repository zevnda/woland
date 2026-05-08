use socket2::{Domain, Protocol, Socket, Type};
use std::net::SocketAddr;

/// Sends a Wake-on-LAN magic packet to the specified MAC address
///
/// The magic packet format:
/// - 6 bytes of 0xFF (sync frame)
/// - 16 repetitions of the target MAC address (6 bytes each)
/// Total: 102 bytes
#[tauri::command]
fn send_wake_on_lan() -> Result<String, String> {
    // Configuration
    let mac_address = [0x10, 0xFF, 0xE0, 0xC7, 0xCE, 0x75];
    let broadcast_addr = "255.255.255.255:9";

    // Create magic packet
    let mut magic_packet = vec![0xFF; 6]; // 6 bytes of 0xFF

    // Repeat MAC address 16 times
    for _ in 0..16 {
        magic_packet.extend_from_slice(&mac_address);
    }

    // Create UDP socket
    let socket = Socket::new(Domain::IPV4, Type::DGRAM, Some(Protocol::UDP))
        .map_err(|e| format!("Failed to create socket: {}", e))?;

    // Enable broadcast on socket
    socket
        .set_broadcast(true)
        .map_err(|e| format!("Failed to enable broadcast: {}", e))?;

    // Parse broadcast address
    let addr: SocketAddr = broadcast_addr
        .parse()
        .map_err(|e| format!("Failed to parse address: {}", e))?;

    // Send magic packet
    socket
        .send_to(&magic_packet, &addr.into())
        .map_err(|e| format!("Failed to send packet: {}", e))?;

    Ok("Wake-on-LAN packet sent successfully!".to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![send_wake_on_lan])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
