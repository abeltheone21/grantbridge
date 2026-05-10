import { getServiceClient } from '@/lib/supabase/server';
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload';

interface AuditLogParams {
  actorId: string;
  action: 'create' | 'update' | 'delete';
  entityType: string;
  entityId: string;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
}

export async function logAuditEvent(params: AuditLogParams): Promise<void> {
  try {
    const supabase = getServiceClient();
    await supabase.from('admin_audit_logs').insert({
      actor_id: params.actorId,
      action: params.action,
      entity_type: params.entityType,
      entity_id: params.entityId,
      before: params.before || null,
      after: params.after || null,
    });
  } catch (err) {
    console.error('[AuditLog] Failed to log:', err);
  }
}

export function createAuditHooks(entityType: string) {
  const afterChange: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req }) => {
    const actorId = req.user?.id != null ? String(req.user.id) : 'system';
    await logAuditEvent({
      actorId,
      action: operation,
      entityType,
      entityId: String(doc.id || ''),
      before: operation === 'update' ? (previousDoc as Record<string, unknown>) || null : null,
      after: doc as Record<string, unknown>,
    });
    return doc;
  };

  const afterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
    const actorId = req.user?.id != null ? String(req.user.id) : 'system';
    await logAuditEvent({
      actorId,
      action: 'delete',
      entityType,
      entityId: String(doc.id || ''),
      before: doc as Record<string, unknown>,
    });
    return doc;
  };

  return { afterChange, afterDelete };
}
