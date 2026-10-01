/**
 * ARCHIVE — packet pedagogy
 *
 * Life of the Packet, beats 4-14. Circuit switching, the wire, header rewrite, TTL, TCP, MPLS, VPN, QoS, SD-WAN. Compressed to a wordless callback (§6).
 *
 * This file is not compiled and is not imported by anything. It sits outside
 * every tsconfig `include`, so it will not break a typecheck and will not be
 * bundled. It exists to be read and lifted from.
 *
 * The beats below are verbatim from the pre-recast script
 * (`apps/keynote/src/beats/script.ts`), including their original doc comments.
 * They reference the `WorldState` of that generation, which the current show
 * no longer has — see `archive/README.md` for what each group needs before it
 * can run again.
 *
 * 12 beats: lotp-circuit, lotp-wire, lotp-rewrite, lotp-ttl, lotp-tcp, lotp-route, lotp-mpls, lotp-vpn, lotp-qos, lotp-sdwan, lotp-close, lotp-bridge
 */

  beat("lotp-circuit", 0, A0, LOTP_CIRCUIT, LOTP_HOP, 11000, packetWorld(2)),

  beat("lotp-wire", 0, A0, LOTP_WIRE, LOTP_REWRITE, 10000, packetWorld(5)),

  beat("lotp-rewrite", 0, A0, LOTP_REWRITE, LOTP_TTL, 11000, packetWorld(6)),

  beat("lotp-ttl", 0, A0, LOTP_TTL, LOTP_TCP, 10000, packetWorld(7)),

  beat("lotp-tcp", 0, A0, LOTP_TCP, LOTP_ROUTE, 11000, packetWorld(8)),

  beat("lotp-route", 0, A0, LOTP_ROUTE, LOTP_CLOSE, 11000, packetWorld(9)),

  beat("lotp-mpls", 1, A1, LOTP_MPLS, LOTP_VPN, 12000, packetWorld(10)),

  beat("lotp-vpn", 1, A1, LOTP_VPN, LOTP_QOS, 11000, packetWorld(11)),

  beat("lotp-qos", 1, A1, LOTP_QOS, LOTP_SDWAN, 11000, packetWorld(12)),

  beat("lotp-sdwan", 1, A1, LOTP_SDWAN, "SAN", 12000, packetWorld(13)),

  beat("lotp-close", 0, A0, LOTP_CLOSE, LOTP_BRIDGE, 12000, packetWorld(14)),

  beat("lotp-bridge", 0, A0, LOTP_BRIDGE, PRE_SCAFFOLD, 10000, packetWorld(14)),
