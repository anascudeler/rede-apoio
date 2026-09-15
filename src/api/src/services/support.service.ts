import { prisma } from '../lib/prisma';
import { RequestSupportInput } from '../validators/support.validator';

export async function requestSupport(requesterId: number, data: RequestSupportInput) {
  if (requesterId === data.supporterId) {
    const error = new Error('Não é possível solicitar apoio de si mesmo');
    (error as any).statusCode = 400;
    throw error;
  }

  const existingRelationship = await prisma.supportRelationship.findFirst({
    where: {
      requesterId,
      supporterId: data.supporterId,
      status: 'PENDING',
    },
  });

  if (existingRelationship) {
    const error = new Error('Já existe uma solicitação pendente entre vocês');
    (error as any).statusCode = 409;
    throw error;
  }

  const relationship = await prisma.supportRelationship.create({
    data: {
      requesterId,
      supporterId: data.supporterId,
      status: 'PENDING',
    },
    include: {
      supporter: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return relationship;
}

export async function acceptSupport(userId: number, relationshipId: number) {
  const relationship = await prisma.supportRelationship.findUnique({
    where: { id: relationshipId },
  });

  if (!relationship) {
    const error = new Error('Solicitação não encontrada');
    (error as any).statusCode = 404;
    throw error;
  }

  if (relationship.supporterId !== userId) {
    const error = new Error('Apenas o apoiante pode aceitar a solicitação');
    (error as any).statusCode = 403;
    throw error;
  }

  if (relationship.status !== 'PENDING') {
    const error = new Error('Solicitação não está pendente');
    (error as any).statusCode = 409;
    throw error;
  }

  const updatedRelationship = await prisma.supportRelationship.update({
    where: { id: relationshipId },
    data: { status: 'ACCEPTED' },
    include: {
      requester: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return updatedRelationship;
}

export async function rejectSupport(userId: number, relationshipId: number) {
  const relationship = await prisma.supportRelationship.findUnique({
    where: { id: relationshipId },
  });

  if (!relationship) {
    const error = new Error('Solicitação não encontrada');
    (error as any).statusCode = 404;
    throw error;
  }

  if (relationship.supporterId !== userId) {
    const error = new Error('Apenas o apoiante pode recusar a solicitação');
    (error as any).statusCode = 403;
    throw error;
  }

  if (relationship.status !== 'PENDING') {
    const error = new Error('Solicitação não está pendente');
    (error as any).statusCode = 409;
    throw error;
  }

  const updatedRelationship = await prisma.supportRelationship.update({
    where: { id: relationshipId },
    data: { status: 'REJECTED' },
    include: {
      requester: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return updatedRelationship;
}

export async function listSupport(userId: number) {
  const supporting = await prisma.supportRelationship.findMany({
    where: { requesterId: userId },
    include: {
      supporter: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const supportedBy = await prisma.supportRelationship.findMany({
    where: { supporterId: userId },
    include: {
      requester: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return {
    supporting: supporting.map((rel) => ({
      id: rel.id,
      user: rel.supporter,
      status: rel.status,
      createdAt: rel.createdAt,
    })),
    supportedBy: supportedBy.map((rel) => ({
      id: rel.id,
      user: rel.requester,
      status: rel.status,
      createdAt: rel.createdAt,
    })),
  };
}

export async function removeSupport(userId: number, relationshipId: number) {
  const relationship = await prisma.supportRelationship.findUnique({
    where: { id: relationshipId },
  });

  if (!relationship) {
    const error = new Error('Relação não encontrada');
    (error as any).statusCode = 404;
    throw error;
  }

  if (relationship.requesterId !== userId) {
    const error = new Error('Apenas quem solicitou pode remover a relação');
    (error as any).statusCode = 403;
    throw error;
  }

  await prisma.supportRelationship.delete({
    where: { id: relationshipId },
  });

  return { message: 'Relação removida com sucesso' };
}
