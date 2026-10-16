import type { Access } from 'payload'

export const isAdmin: Access = ({ req }) => Boolean(req.user)

export const anyone: Access = () => true
