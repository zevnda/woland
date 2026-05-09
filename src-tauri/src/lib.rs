use socket2::{Domain, Protocol, Socket, Type};
use std::net::SocketAddr;

/// Parse MAC address from string format
fn parse_mac_address(mac_str: &str) -> Result<[u8; 6], String> {
    let parts: Vec<&str> = mac_str.split(|c| c == ':' || c == '-').collect();
    if parts.len() != 6 {
        return Err("MAC address must have 6 octets".to_string());
    }

    let mut mac = [0u8; 6];
    for (i, part) in parts.iter().enumerate() {
        mac[i] = u8::from_str_radix(part, 16).map_err(|e| format!("Invalid MAC byte: {}", e))?;
    }
    Ok(mac)
}

#[tauri::command]
fn send_wake_on_lan(mac: String, broadcast_addr: String) -> Result<String, String> {
    eprintln!("[WOL] MAC: {}, Broadcast: {}", mac, broadcast_addr);

    let mac_address = parse_mac_address(&mac)?;

    // Create magic packet
    let mut magic_packet = vec![0xFF; 6];
    for _ in 0..16 {
        magic_packet.extend_from_slice(&mac_address);
    }

    // Create UDP socket
    let socket = Socket::new(Domain::IPV4, Type::DGRAM, Some(Protocol::UDP))
        .map_err(|e| format!("Failed to create socket: {}", e))?;

    socket
        .set_broadcast(true)
        .map_err(|e| format!("Failed to enable broadcast: {}", e))?;

    let addr: SocketAddr = broadcast_addr
        .parse()
        .map_err(|e| format!("Failed to parse address: {}", e))?;

    socket
        .send_to(&magic_packet, &addr.into())
        .map_err(|e| format!("Failed to send packet: {}", e))?;

    Ok("WOL packet sent".to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![send_wake_on_lan])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
